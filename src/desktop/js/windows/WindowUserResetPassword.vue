<template>
  <win-window ref="window" name="user-reset-password" title="Reset password" :width="280">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- New password -->
          <label for="password">New password:</label>
          <input class="d-block mb-2" id="password" type="password" v-model="password"/>

          <!-- Repeat password -->
          <label for="password_repeat">Password repeat:</label>
          <input class="d-block" id="password_repeat" type="password" v-model="passwordRepeat"/>

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block @click="change" class="text-bold">Change</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="router.push({name: 'index'})">Cancel</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '@common/js/api/api'
import windowsComposable from '@common/js/composables/windowsComposable'

const router = useRouter()

// Props
const props = defineProps({
  token: {
    type: String,
    default: '',
  },
})

// Composable
const { closeWindow, alert2 } = windowsComposable('user-reset-password')

// Reactive data
const password = ref('')
const passwordRepeat = ref('')

// Non-reactive
let sending = false

function change () {
  if (!validate() || sending.value) {
    return
  }

  sending = true

  user.confirmReset({ token: props.token, password: password.value }).then(() => {
    alert2('Password has changed.', 'Success', 'info')
    closeWindow()
  }).catch(err => alert2(err.response.data.error, 'Error')).finally(() => sending = false)
}

function validate () {
  if (password.value.length < 3) {
    alert2('Password is too short.', 'Error')
    return false
  }

  if (password.value !== passwordRepeat.value) {
    alert2('Passwords didn\'t match.', 'Error')
    return false
  }

  return true
}
</script>
