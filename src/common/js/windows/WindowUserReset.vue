<template>
  <win-window ref="win" :width="320" name="user-reset" :title="t('win.user_reset.title')" v-slot="winProps">
    <div class="p-2">

      <p class="pb-3 px-3 text-center">{{ t('win.user_reset.instruction') }}</p>

      <!-- Email -->
      <div class="row no-gutters mb-3">
        <div class="col-6 offset-3">
          <label for="email">{{ t('win.user_reset.enter_email') }}:</label>
          <input id="email" v-model="fields.email" class="d-block" type="email"/>
        </div>
      </div>

      <vue-turnstile site-key="0x4AAAAAAAJlKRFzqmHHqPtK" v-model="captchaResponse" v-if="showCaptcha"/>

      <!-- Buttons -->
      <div class="row no-gutters">
        <div class="col-sm-8 offset-sm-2">
          <div class="py-2 row no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="reset" :disabled="sending">{{ t('win.user_login.reset') }}</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
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
import { api } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import VueTurnstile from 'vue-turnstile'
import WinWindow from '@common/js/components/WinWindow.vue'
import type { UserReset } from '@common/js/types'

const { t } = useI18n()
const windowsStore = useWindowsStore()

const fields: UserReset = reactive({
  email: '',
})

const win = ref<InstanceType<typeof WinWindow>>()
const showCaptcha = ref(false)
const captchaResponse = ref('')
const sending = ref(false)

function reset () {
  if (fields.email.length === 0) {
    windowsStore.alert(t('errors.enter_email'), t('alert.error.title'))
    return false
  }

  showCaptcha.value = true
}

function completeCaptcha () {
  sending.value = true

  api.user.reset({ ...fields, captcha_response: captchaResponse.value }).then(() => {
    windowsStore.alert(
        t('alert.reset_success.message'),
        t('alert.reset_success.title'), 'info'
    )
    win.value!.close()
  }).catch(e => {
    showCaptcha.value = false
    windowsStore.alert(
        t('alert.error.message', {error: (e as Error).message}),
        t('alert.error.title')
    )
  }).finally(() => sending.value = false)
}

watch(captchaResponse, () => {
  setTimeout(() => {
    completeCaptcha()
  }, 2000)
})
</script>
