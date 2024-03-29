<template>
  <win-window ref="window" :width="250" name="user-password" title="Change Password">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- Current password -->
          <label for="current_password">Current password:</label>
          <input id="current_password" v-model="fields.current_password" class="d-block mb-2" type="password"/>
          <!-- New password password -->
          <label for="password">New password:</label>
          <input id="password" v-model="fields.password" class="d-block mb-2" type="password"/>
          <!-- Repeat password -->
          <label for="password_repeat">Password repeat:</label>
          <input id="password_repeat" v-model="passwordRepeat" class="d-block" type="password"/>

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block class="text-bold" @click="change">Change</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="closeWindow">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { user } from '@common/js/api/api'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()

// Composable
const { alert2, closeWindow, openWindow } = windowsComposable('user-password')

// Reactive data
const fields = reactive({
  current_password: '',
  password: '',
})
const passwordRepeat = ref('')

// Non-reactive
let sending = false

function change () {
  if (!validate() || sending) {
    return
  }

  sending = true

  user.edit(fields).then(() => {
    store.dispatch('logout')
    alert2('Password has changed!', 'Success', 'info')
    closeWindow()
  }).catch(err => alert2(err.response.data.error, 'Error'))
  .finally(() => sending = false)
}

function validate () {
  if (fields.current_password.length === 0) {
    alert2('Enter current password.', 'Error')
    return false
  }

  if (fields.password.length < 3) {
    alert2('Password too short.', 'Error')
    return false
  }

  if (fields.password !== passwordRepeat.value) {
    alert2('Passwords didn\'t match.', 'Error')
    return false
  }

  return true
}
</script>
