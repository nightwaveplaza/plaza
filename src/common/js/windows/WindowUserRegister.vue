<template>
  <win-window ref="win" :width="430" name="user-register" title="Registration">
    <div class="p-2 noselect">
      <template v-if="step === 1">
        <div class="row no-gutters">
          <div class="col-sm-4 d-none d-sm-block">
            <img alt="register" class="img-register" src="@common/img/register.png"/>
          </div>

          <div class="col-12 col-sm-8 d-flex flex-column">
            <div class="d-flex flex-grow-1 flex-column mb-fix">
              <p class="lead">User Information:</p>
              <p class="mt-2 mb-3">Please fill out the registration form. All fields are required.</p>

              <!-- Username -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-username"><u>U</u>sername:</label>
                </div>
                <div class="col-7">
                  <input id="register-username" v-model="fields.username" class="d-block m-0" tabindex="1" type="text"/>
                </div>
              </div>

              <!-- Password -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-password"><u>P</u>assword:</label>
                </div>
                <div class="col-7">
                  <input id="register-password" v-model="fields.password" class="d-block m-0" tabindex="2"
                         type="password"/>
                </div>
              </div>

              <!-- Password repeat -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-password-repeat"><u>P</u>assword repeat:</label>
                </div>
                <div class="col-7">
                  <input id="register-password-repeat" v-model="passwordR" class="d-block m-0" tabindex="3"
                         type="password"/>
                </div>
              </div>

              <!-- Email -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-email"><u>E</u>mail:</label>
                </div>
                <div class="col-7">
                  <input id="register-email" v-model="fields.email" class="d-block m-0" tabindex="4" type="email"/>
                </div>
              </div>
            </div>

            <div class="d-flex flex-grow-0">
              <div class="row no-gutters mt-2 justify-content-between flex-grow-1 mb-fix">
                <div class="col-4">
                  <win-btn block class="text-bold" @click="register">Register</win-btn>
                </div>
                <div class="col-4">
                  <win-btn block @click="close">Cancel</win-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>


      <div class="text-center" v-else-if="step === 2">
        <p class="lead"><em>are you still human?</em></p>
        <p class="mt-2">Please fill this annoying captcha.</p>
        <div class="d-inline-block my-3">
          <vue-turnstile site-key="0x4AAAAAAAJlKRFzqmHHqPtK" v-model="fields.captcha_response"/>
        </div>
        <br/>
        <win-btn @click="completeCaptcha" class="mx-auto px-4 text-bold">Continue</win-btn>
      </div>

      <!--        <template v-else>-->
      <!--          <p class="lead">Registration complete</p>-->
      <!--          <p class="my-2">Welcome to Nightwave Plaza, <strong>{{ fields.username }}</strong>!</p>-->
      <!--          <p>Now you use the like button.</p>-->
      <!--        </template>-->
    </div>
  </win-window>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '@common/js/api/api'
import windowsComposable from '@common/js/composables/windowsComposable'
import VueTurnstile from 'vue-turnstile'

const router = useRouter()

// Props
const props = defineProps({
  direct: {
    type: Boolean,
    default: false,
  },
})

// Composable
const { alert, openWindow } = windowsComposable()

// Reactive data
const fields = reactive({
  username: '',
  email: '',
  password: '',
  captcha_response: '',
})
const step = ref(1)
const passwordR = ref('')

// Refs
const win = ref('win')

// Non-reactive
let sending = false

/**
 * User register
 */
function register () {
  if (!validate() || sending) {
    return
  }

  step.value = 2
}

function completeCaptcha () {
  if (fields.captcha_response === '') {
    alert('Captcha validation failed', 'Error')
    step.value = 1
    return
  }

  sending = true

  user.register(fields).then(() => {
    alert(`Welcome to the Nightwave Plaza, <strong>${fields.username}</strong>!`, 'Registration complete', 'info')
    win.value.close()
  }).catch(err => {
    alert(err.response.data.error, 'Error')
    step.value = 1
  }).finally(() => sending = false)
}

/**
 * Fields validation
 * @returns {boolean|void}
 */
function validate () {
  if (/[^a-zA-Z0-9-_]+/.test(fields.username)) {
    alert('Incorrect username. Only letters, numbers and underscores allowed.', 'Error')
    return false
  }

  if (fields.username.length < 4) {
    alert('Username is too short.', 'Error')
    return false
  }

  if (fields.username.length > 32) {
    alert('Username is too long.', 'Error')
    return false
  }

  if (fields.password.length < 3) {
    alert('Password is too short.', 'Error')
    return false
  }

  if (fields.email.length < 3) {
    alert('Email is too short.', 'Error')
    return false
  }

  if (fields.password !== passwordR.value) {
    alert('Passwords don\'t match.', 'Error')
    return false
  }

  return true
}

function close () {
  if (props.direct) {
    router.push({ name: 'index' })
  } else {
    win.value.close()
  }
}
</script>
