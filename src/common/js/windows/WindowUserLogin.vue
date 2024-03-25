<template>
  <win-window ref="win" :width="480" name="user-login" title="Sign In" v-slot="winProps">
    <div class="noselect">
      <div class="row no-gutters p-2">
        <div class="col-12 d-block d-sm-none mb-3 p-0">
          Type a username and password to sign in to the Nightwave Plaza.
        </div>

        <div class="col-auto d-none d-sm-block pr-3">
          <img alt="" class="img-key" height="48" src="@common/img/key.png" width="45"/>
        </div>

        <div class="col pl-0 pr-2">
          <div class="row no-gutters d-none d-sm-block mb-2">
            <div class="col-12">
              Type a username and password to log in to Nightwave Plaza.
            </div>
          </div>

          <!-- Username -->
          <div class="row no-gutters">
            <div class="col-12 col-sm-3 align-self-center">
              <label class="mt-0" for="username"><u>U</u>sername:</label>
            </div>
            <div class="col-12 col-sm-9">
              <input id="username" v-model="fields.username" class="mr-0 ml-0" type="text"/>
            </div>
          </div>

          <!-- Password -->
          <div class="row mt-1 no-gutters">
            <div class="col-12 col-sm-3 align-self-center">
              <label class="mt-0" for="password"><u>P</u>assword:</label>
            </div>
            <div class="col-12 col-sm-9">
              <input id="password" v-model="fields.password" class="mr-0 ml-0" type="password"/>
              &nbsp;<a role="button" @click="openReset">Reset</a>
            </div>
          </div>

          <!-- Remember -->
          <div class="row mt-1 no-gutters justify-content-end" v-if="!isMobile">
            <div class="col-12 col-sm-9">
              <div class="checkbox">
                <input id="remember" v-model="remember" type="checkbox"/>
                <label for="remember">Remember me</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-auto col-sm-2 p-0 login-buttons">
          <win-btn class="mb-2 text-bold" @click="login">Sign In</win-btn>
          <win-btn class="mb-2" @click="openRegister">Register</win-btn>
          <win-btn @click="winProps.close()">Cancel</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { user } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import type { ifcUserLogin } from '@common/js/types'

const { isMobile } = helperComposable()

const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()

const fields: ifcUserLogin = reactive({
  username: '',
  password: '',
})
const remember = ref(false)

// Non-reactive
let sending = false

function login () {
  if (!validate() || sending) {
    return
  }

  sending = true

  user.login(fields).then((res) => {
    userAuthStore.login(res.data, remember.value)
    windowsStore.alert('Authentication successful!', 'Success', 'info')
    win.value!.close()
  }).catch(err => windowsStore.alert(err.response.data.error, 'Failed')).finally(() => sending = false)
}

function validate () {
  if (fields.username.length === 0 || fields.password.length === 0) {
    windowsStore.alert('Wrong username or password.', 'Error')
    return false
  }

  return true
}

function openRegister () {
  windowsStore.open('user-register')
  win.value!.close()
}

function openReset () {
  windowsStore.open('user-reset')
  win.value!.close()
}
</script>
