<template>
  <win-window ref="win" :name="name" title="Reset password" :width="280">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- New password -->
          <label for="password">{{ t('win.user_password.new') }}:</label>
          <input id="password" v-model="password" class="d-block mb-2" type="password">

          <!-- Repeat password -->
          <label for="password_repeat">{{ t('win.user_password.repeat') }}:</label>
          <input id="password_repeat" v-model="passwordRepeat" class="d-block" type="password">

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-button block class="text-bold" @click="change">
                {{ t('buttons.change') }}
              </win-button>
            </div>
            <div class="col-4">
              <win-button block @click="router.push({name: 'index'})">
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
import { useRouter } from 'vue-router'
import { api } from '@app/api/api'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@app/composables/useApiError.ts'
import { useAlerts } from '@app/composables/useAlerts.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { WinType } from '@app/types/types.ts'

const { t } = useI18n()
const router = useRouter()
const { winAlert } = useAlerts()
const { closeWindow } = useWindows()

// Props
const props = defineProps({
  name: {
    type: String,
    default: 'user-reset-password'
  },
  token: {
    type: String,
    default: '',
  },
})

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

  api.user.confirmReset({ token: props.token, password: password.value }).then(() => {
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
