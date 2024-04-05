<template>
  <win-window ref="win" name="user-reset-password" title="Reset password" :width="280">
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'

const router = useRouter()
const windowsStore = useWindowsStore()

// Props
const props = defineProps({
  token: {
    type: String,
    default: '',
  },
})

const win = ref<InstanceType<typeof WinWindow>>()
const password = ref('')
const passwordRepeat = ref('')

// Non-reactive
let sending = false

function change () {
  if (!validate() || sending) {
    return
  }

  sending = true

  api.user.confirmReset({ token: props.token, password: password.value }).then(() => {
    windowsStore.alert('Password has changed.', 'Success', 'info')
    win.value!.close()
  }).catch(e => {
    windowsStore.alert((e as Error).message, 'Error')
  }).finally(() => sending = false)
}

function validate () {
  if (password.value.length < 3) {
    windowsStore.alert('Password is too short.', 'Error')
    return false
  }

  if (password.value !== passwordRepeat.value) {
    windowsStore.alert('Passwords didn\'t match.', 'Error')
    return false
  }

  return true
}
</script>
