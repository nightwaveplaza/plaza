<template>
  <div class="p-2">
    <div class="row mb-3">
      <div class="col-3 pe-1 align-self-center text-center">
        <img src="@app/assets/img/keys-5.png" alt="keys" />
      </div>
      <div class="col">
        <p class="mb-2">{{ t('win.user_reset.instruction') }}</p>
        <label for="email">{{ t('fields.email') }}:</label>
        <input id="email" v-model="fields.email" class="d-block m-0" tabindex="4" type="email">
      </div>
    </div>

    <win-captcha v-model="fields.captcha_response" class="mb-3" />

    <!-- Buttons -->
    <div class="row gx-0 justify-content-between">
      <div class="col-6">
        <win-button block :disabled="isLoading || fields.captcha_response === ''" class="fw-bold" @click="reset">
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
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuthApi } from '@app/composables/api'
import { type UserResetForm, Win } from '@app/types'

const { t } = useI18n()
const { showAlert, closeWindow } = useWindows()
const { resetPassword } = useAuthApi()
const { isLoading, fetch } = resetPassword()

const fields: UserResetForm = reactive({
  email: '',
  captcha_response: '',
})

function reset (): void {
  if (fields.email.length === 0) {
    return showAlert(t('errors.fields.email_required'), t('errors.error'))
  }

  fetch(fields).then(() => {
    showAlert(t('messages.reset_success'), t('messages.success'), 'info')
    closeWindow(Win.USER_RESET)
  }).catch(e => {
    showAlert(e.message, t('errors.error'))
  })
}
</script>

<style lang="scss">
#window-user-reset {
  .captcha > div {
    line-height: 0;
  }
}
</style>
