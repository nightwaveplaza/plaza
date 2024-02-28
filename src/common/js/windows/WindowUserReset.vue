<template>
  <win-window ref="window" :width="320" name="user-reset" title="Reset password">
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

      <vue-turnstile site-key="0x4AAAAAAAJlKRFzqmHHqPtK" v-model="captchaResponse" v-if="showCaptcha" />

      <!-- Buttons -->
      <div class="row no-gutters">
        <div class="col-sm-8 offset-sm-2">
          <div class="py-2 row no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="reset">Reset</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="window.close()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { user } from '@common/js/api/api'
import windowsComposable from '@common/js/composables/windowsComposable'
import VueTurnstile from 'vue-turnstile'

// Composable
const { alert, openWindow } = windowsComposable()

// Reactive data
const fields = reactive({
  email: ''
})

const window = ref('window')
const showCaptcha = ref(false)
const captchaResponse = ref('')

// Non-reactive
let sending = false

watch(captchaResponse, (value) => {
  setTimeout(() => {
    completeCaptcha(value)
  }, 2000)
})

function reset () {
  if (!validate() || sending) {
    return
  }

  showCaptcha.value = true
}

function completeCaptcha() {
  sending = true

  user.reset({...fields, captcha_response: captchaResponse.value}).then(() => {
    alert('Instructions have been sent to your email.', 'Success', 'info')
    window.value.close()
  }).catch(err => {
    showCaptcha.value = false
    alert(err.response.data.error, 'Error')
  }).finally(() => sending = false)
}

function validate () {
  if (fields.email.length === 0) {
    alert('Enter email.', 'Error')
    return false
  }
  return true
}

function refreshCaptcha (key) {
  fields.key = key
  fields.captcha = ''
}
</script>
