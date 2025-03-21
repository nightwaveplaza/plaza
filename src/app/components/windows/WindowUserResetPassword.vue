<template>
  <win-window ref="win" :name="name" :title="t('win.user_password.title')" :width="280">
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
              <win-button block class="text-bold" @click="change">
                {{ t('buttons.change') }}
              </win-button>
            </div>
            <div class="col-4">
              <win-button block @click="closeWindow(WinType.USER_RESET_PASSWORD)">
                {{ t('buttons.cancel') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@app/api/api'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@app/composables/useApiError.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useUserAuthStore } from '@app/stores/userAuthStore.ts'

const { t } = useI18n()
const { closeWindow, WinType, winAlert } = useWindows()
const userAuthStore = useUserAuthStore()

defineProps<{
  name: string,
}>()

const password = ref('')
const passwordRepeat = ref('')
const sending = ref(false)

function change (): void {
  try {
    validate()
  } catch (e) {
    return winAlert((e as Error).message, t('errors.error'))
  }

  sending.value = true

  api.user.confirmReset({ token: userAuthStore.resetToken!!, password: password.value }).then(() => {
    winAlert(t('messages.password_changed'), t('messages.success'), 'info')
    closeWindow(WinType.USER_RESET_PASSWORD)
  }).catch(e => {
    winAlert(useApiError(e), t('errors.error'))
  }).finally(() => sending.value = false)
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
