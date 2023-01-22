<template>
  <win-window ref="window" :width="250" name="user-reset" title="Reset password">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- Email -->
          <label for="email">Enter your Email:</label>
          <input id="email" v-model="fields.email" class="d-block mb-2" type="email"/>

          <!-- Captcha -->
          <label for="captcha">Captcha:</label>
          <input id="captcha" v-model="fields.captcha" class="d-block mb-2" type="text"/>
          <win-captcha ref="captcha" @refreshed="refreshCaptcha"/>

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="reset">Reset</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="closeWindow2">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { user } from '@common/api/api'
import windowsComposable from '@common/composables/windowsComposable'

// Composable
const { alert2, closeWindow2, openWindow2 } = windowsComposable('user-reset')

// Reactive data
const fields = reactive({
  email: '',
  key: '',
  captcha: '',
})

// Refs
const captcha = ref(null)

// Non-reactive
let sending = false

function reset () {
  if (!validate() || sending) {
    return
  }

  sending = true

  user.reset(fields).then(() => {
    alert2('Instructions have been sent to your email.', 'Success', 'info')
    closeWindow2()
  }).catch(err => {
    alert2(err.response.data.error, 'Error')
    captcha.value.refresh()
  }).finally(() => sending = false)
}

function validate () {
  if (fields.email.length === 0) {
    alert2('Enter email.', 'Error')
    return false
  }
  return true
}

function refreshCaptcha (key) {
  fields.key = key
  fields.captcha = ''
}
</script>
