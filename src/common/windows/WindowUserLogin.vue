<template>
  <win-window ref="window" :width="480" name="user-login" title="Sign In">
    <div class="noselect">
      <div class="row no-gutters p-2">
        <div class="col-12 d-block d-sm-none mb-3 p-0">
          Type a username and password to sign in to the Nightwave Plaza.
        </div>

        <div class="col-auto d-none d-sm-block pr-3">
          <img alt="" class="img-key" height="48" src="img/win/key.png" width="45"/>
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
          <win-btn @click="closeWindow2">Cancel</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { user } from '@common/api/api'
import windowsComposable from '@common/composables/windowsComposable'
import helperComposable from '@common/composables/helperComposable'

// Composable
const { isMobile } = helperComposable()
const { alert2, closeWindow2, openWindow2 } = windowsComposable('user-login')

const store = useStore()

// Reactive data
const fields = reactive({
  username: '',
  password: '',
})
const remember = ref(false)
const sending = ref(false)

// Methods

function login () {
  if (!validate() || sending.value) {
    return
  }

  sending.value = true

  user.auth(fields).then((res) => {
    if (isMobile.value) {
      store.dispatch('login', res.data)
      alert2('Authentication successful!', 'Success', 'info')
    } else {
      store.dispatch('login', { user: res.data, remember: remember.value })
    }

    closeWindow2()
  }).catch(err => {
    alert2(err.response.data.error, 'Failed')
  }).finally(() => {
    sending.value = false
  })
}

function validate () {
  if (fields.username.length === 0 || fields.password.length === 0) {
    alert2('Wrong username or password.', 'Error')
    return false
  }

  return true
}

function openRegister () {
  openWindow2('user-register')
  closeWindow2()
}

function openReset () {
  openWindow2('user-reset')
  closeWindow2()
}

onMounted(() => {
  sending.value = false
})
</script>
