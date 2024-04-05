<template>
  <win-window ref="win" :width="320" name="user-reset" title="Reset password" v-slot="winProps">
    <div class="p-2">

      <p class="pb-3 px-3 text-center">Enter your email address and click the
        button &mdash; an email will be sent to you with a link to reset your password.</p>

      <!-- Email -->
      <div class="row no-gutters mb-3">
        <div class="col-6 offset-3">
          <label for="email">Enter your Email:</label>
          <input id="email" v-model="fields.email" class="d-block" type="email"/>
        </div>
      </div>

      <vue-turnstile site-key="0x4AAAAAAAJlKRFzqmHHqPtK" v-model="captchaResponse" v-if="showCaptcha"/>

      <!-- Buttons -->
      <div class="row no-gutters">
        <div class="col-sm-8 offset-sm-2">
          <div class="py-2 row no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="reset">Reset</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="winProps.close()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { api } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import VueTurnstile from 'vue-turnstile'
import WinWindow from '@common/js/components/WinWindow.vue'
import type { UserReset } from '@common/js/types'

const windowsStore = useWindowsStore()

const fields: UserReset = reactive({
  email: '',
})

const win = ref<InstanceType<typeof WinWindow>>()
const showCaptcha = ref(false)
const captchaResponse = ref('')

// Non-reactive
let sending = false

function reset () {
  if (!validate() || sending) {
    return
  }

  showCaptcha.value = true
}

function completeCaptcha () {
  sending = true

  api.user.reset({ ...fields, captcha_response: captchaResponse.value }).then(() => {
    windowsStore.alert('Instructions have been sent to your email.', 'Success', 'info')
    win.value!.close()
  }).catch(e => {
    showCaptcha.value = false
    windowsStore.alert((e as Error).message, 'Error')
  }).finally(() => sending = false)
}

function validate () {
  if (fields.email.length === 0) {
    windowsStore.alert('Enter email.', 'Error')
    return false
  }
  return true
}

watch(captchaResponse, () => {
  setTimeout(() => {
    completeCaptcha()
  }, 2000)
})
</script>
