<template>
  <div class="py-2 px-2">
    <win-panel class="mb-3">
      <!-- Current password -->
      <label for="current_password">{{ t('fields.current_password') }}:</label>
      <input id="current_password" v-model="fields.current_password" class="d-block mb-2" type="password">
      <!-- New password password -->
      <label for="password">{{ t('fields.new_password') }}:</label>
      <input id="password" v-model="fields.password" class="d-block mb-2" type="password">
      <!-- Repeat password -->
      <label for="password_repeat">{{ t('fields.repeat_password') }}:</label>
      <input id="password_repeat" v-model="passwordRepeat" class="d-block" type="password">
    </win-panel>

    <!-- Buttons -->
    <div class="row mt-2 no-gutters justify-content-between">
      <div class="col-6">
        <win-button block class="text-bold" :disabled="isLoading" @click="change">
          {{ t('buttons.change') }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button block @click="closeWindow(Win.USER_PASSWORD)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useUserApi } from '@app/composables/api'
import { type UserPasswordForm, Win } from '@app/types'
import { useAuth } from '@app/composables/useAuth.ts'

const { t } = useI18n()
const { winAlert, closeWindow } = useWindows()
const { updatePassword } = useUserApi()
const { isLoading, fetch: update } = updatePassword()
const { unsetUser } = useAuth()

const fields: UserPasswordForm = reactive({
  current_password: '',
  password: '',
})
const passwordRepeat = ref('')

function change (): void {
  try {
    validate()
  } catch (e) {
    return winAlert((e as Error).message, t('errors.error'))
  }

  update(fields).then(() => {
    unsetUser()
    winAlert(t('messages.password_changed'), t('messages.success'), 'info')
    closeWindow(Win.USER_PASSWORD)
  }).catch(e =>
      winAlert(e.message, t('errors.error'))
  )
}

function validate (): void {
  if (fields.current_password.length === 0) {
    throw new Error(t('errors.enter_current_password'))
  }

  if (fields.password!.length < 3) {
    throw new Error(t('errors.fields.password_min'))
  }

  if (fields.password !== passwordRepeat.value) {
    throw new Error(t('errors.fields.password_match'))
  }
}
</script>
