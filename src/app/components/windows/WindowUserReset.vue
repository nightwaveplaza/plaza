<template>
  <win-window v-slot="winProps" ref="win" :width="320" :name="name" :title="t('win.user_reset.title')">
    <div class="p-2">
      <p class="pb-3 px-3 text-center">
        {{ t('win.user_reset.instruction') }}
      </p>

      <!-- Email -->
      <div class="row no-gutters mb-3">
        <div class="col-6 offset-3">
          <label for="email">{{ t('win.user_reset.enter_email') }}:</label>
          <input id="email" v-model="fields.email" class="d-block" type="email">
        </div>
      </div>

      <vue-turnstile v-if="showCaptcha" v-model="captchaResponse" site-key="0x4AAAAAAAJlKRFzqmHHqPtK" />

      <!-- Buttons -->
      <div class="row no-gutters">
        <div class="col-sm-8 offset-sm-2">
          <div class="py-2 row no-gutters justify-content-between">
            <div class="col-6">
              <win-button block class="text-bold" :disabled="sending" @click="reset">
                {{ t('win.user_login.btn_reset') }}
              </win-button>
            </div>
            <div class="col-4">
              <win-button block @click="winProps.close()">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@app/api/api'
import VueTurnstile from 'vue-turnstile'
import WinWindow from '@app/components/basic/WinWindow.vue'
import type { UserReset } from '@app/types/types'
import { useApiError } from '@app/composables/useApiError.ts'
import { useAlerts } from '@app/composables/useAlerts.ts'

const { t } = useI18n()
const { winAlert } = useAlerts()

defineProps<{
  name: string,
}>()

const fields: UserReset = reactive({
  email: '',
})

const win = ref<InstanceType<typeof WinWindow>>()
const showCaptcha = ref(false)
const captchaResponse = ref('')
const sending = ref(false)

function reset (): void {
  if (fields.email.length === 0) {
    return winAlert(t('errors.fields.email_required'), t('errors.error'))
  }

  showCaptcha.value = true
}

function completeCaptcha (): void {
  sending.value = true

  api.user.reset({ ...fields, captcha_response: captchaResponse.value }).then(() => {
    winAlert(t('messages.reset_success'), t('messages.success'), 'info')
    win.value!.close()
  }).catch(e => {
    showCaptcha.value = false
    winAlert(useApiError(e), t('errors.error'))
  }).finally(() => sending.value = false)
}

watch(captchaResponse, () => {
  setTimeout(() => {
    completeCaptcha()
  }, 2000)
})
</script>
