<template>
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

    <vue-turnstile v-if="showCaptcha" v-model="fields.captcha_response" site-key="0x4AAAAAAAJlKRFzqmHHqPtK" />

    <!-- Buttons -->
    <div class="row no-gutters">
      <div class="col-sm-8 offset-sm-2">
        <div class="py-2 row no-gutters justify-content-between">
          <div class="col-6">
            <win-button block class="text-bold" :disabled="isLoading" @click="reset">
              {{ t('win.user_login.btn_reset') }}
            </win-button>
          </div>
          <div class="col-4">
            <win-button block @click="closeWindow(Win.USER_RESET)">
              {{ t('buttons.close') }}
            </win-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VueTurnstile from 'vue-turnstile'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuthApi } from '@app/composables/api'
import { type UserResetForm, Win } from '@app/types'

const { t } = useI18n()
const { winAlert, closeWindow } = useWindows()
const { resetPassword } = useAuthApi()
const { isLoading, fetch } = resetPassword()

const fields: UserResetForm = reactive({
  email: '',
  captcha_response: '',
})

const win = ref<InstanceType<typeof WinWindow>>()
const showCaptcha = ref(false)

function reset (): void {
  if (fields.email.length === 0) {
    return winAlert(t('errors.fields.email_required'), t('errors.error'))
  }

  showCaptcha.value = true
}

function completeCaptcha (): void {
  fetch(fields).then(() => {
    winAlert(t('messages.reset_success'), t('messages.success'), 'info')
    win.value!.close()
  }).catch(e => {
    showCaptcha.value = false
    winAlert(e.message, t('errors.error'))
  })
}

watch(() => fields.captcha_response, () => {
  setTimeout(() => {
    completeCaptcha()
  }, 2000)
})
</script>
