<template>
  <div class="py-2">
    <div class="row no-gutters">
      <div class="col-10 offset-1">
        <!-- New password -->
        <label for="password">{{ t('fields.new_password') }}:</label>
        <input id="password" v-model="password" class="d-block mb-2" type="password">

        <!-- Repeat password -->
        <label for="password_repeat">{{ t('fields.repeat_password') }}:</label>
        <input id="password_repeat" v-model="passwordRepeat" class="d-block" type="password">

        <!-- Buttons -->
        <div class="row mt-2 no-gutters justify-content-between">
          <div class="col-6">
            <win-button block class="text-bold" :disabled="isLoading" @click="change">
              {{ t('buttons.change') }}
            </win-button>
          </div>
          <div class="col-4">
            <win-button block @click="closeWindow(Win.USER_RESET_PASSWORD)">
              {{ t('buttons.cancel') }}
            </win-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuthApi } from '@app/composables/api'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'

const { t } = useI18n()
const { closeWindow, winAlert } = useWindows()
const { resetPasswordConfirm } = useAuthApi()
const { isLoading, fetch } = resetPasswordConfirm()
const { resetToken } = useAuth()

const password = ref('')
const passwordRepeat = ref('')

function change (): void {
  try {
    validate()
  } catch (e) {
    return winAlert((e as Error).message, t('errors.error'))
  }

  fetch({ token: resetToken.value!, password: password.value }).then(() => {
    winAlert(t('messages.password_changed'), t('messages.success'), 'info')
    closeWindow(Win.USER_RESET_PASSWORD)
  }).catch(e => {
    winAlert(e.message, t('errors.error'))
  })
}

function validate (): void {
  if (password.value.length < 3) {
    throw new Error(t('errors.fields.password_min'))
  }

  if (password.value !== passwordRepeat.value) {
    throw new Error(t('errors.fields.password_match'))
  }
}
</script>
