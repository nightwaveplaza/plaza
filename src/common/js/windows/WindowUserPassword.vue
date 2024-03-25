<template>
  <win-window ref="win" :width="250" name="user-password" title="Change Password" v-slot="winProps">
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
              <win-btn block @click="winProps.close()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { user } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import type { ifcUserEdit } from '@common/js/types'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import WinWindow from '@common/js/components/WinWindow.vue'

const windowsStore = useWindowsStore()
const userAuthStore = useUserAuthStore()

const win = ref<InstanceType<typeof WinWindow>>()
const fields: ifcUserEdit = reactive({
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
    userAuthStore.logout()
    windowsStore.alert('Password has changed!', 'Success', 'info')
    win.value!.close()
  }).catch(err =>
    windowsStore.alert(err.response.data.error, 'Error')
  ).finally(() => sending = false)
}

function validate () {
  if (fields.current_password.length === 0) {
    windowsStore.alert('Enter current password.', 'Error')
    return false
  }

  if (fields.password!.length < 3) {
    windowsStore.alert('Password too short.', 'Error')
    return false
  }

  if (fields.password !== passwordRepeat.value) {
    windowsStore.alert('Passwords didn\'t match.', 'Error')
    return false
  }

  return true
}
</script>
