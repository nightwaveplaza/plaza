<template>
  <div class="p-2 noselect">
    <template v-if="step === 1">
      <div class="row gx-0">
        <div class="col-sm-4 d-none d-sm-block">
          <img alt="register" class="img-register" src="@app/assets/img/register.png">
        </div>

        <div class="col-12 col-sm-8 d-flex flex-column">
          <div class="d-flex flex-grow-1 flex-column mb-fix">
            <p class="lead">
              {{ t('win.user_register.user_information') }}:
            </p>
            <p class="mt-2 mb-3">
              {{ t('win.user_register.please_fill') }}
            </p>

            <!-- Username -->
            <div class="row gx-0 mb-2">
              <div class="col-5 align-self-center">
                <label for="register-username">{{ t('fields.username') }}:</label>
              </div>
              <div class="col-7">
                <input id="register-username" v-model="fields.username" class="d-block m-0" tabindex="1" type="text">
              </div>
            </div>

            <!-- Password -->
            <div class="row gx-0 mb-2">
              <div class="col-5 align-self-center">
                <label for="register-password">{{ t('fields.password') }}:</label>
              </div>
              <div class="col-7">
                <input id="register-password" v-model="fields.password" class="d-block m-0" tabindex="2" type="password">
              </div>
            </div>

            <!-- Password repeat -->
            <div class="row gx-0 mb-2">
              <div class="col-5 align-self-center">
                <label for="register-password-repeat">{{ t('fields.repeat_password') }}:</label>
              </div>
              <div class="col-7">
                <input id="register-password-repeat" v-model="passwordR" class="d-block m-0" tabindex="3" type="password">
              </div>
            </div>

            <!-- Email -->
            <div class="row gx-0 mb-2">
              <div class="col-5 align-self-center">
                <label for="register-email">{{ t('fields.email') }}:</label>
              </div>
              <div class="col-7">
                <input id="register-email" v-model="fields.email" class="d-block m-0" tabindex="4" type="email">
              </div>
            </div>
          </div>

          <div class="d-flex flex-grow-0">
            <div class="row gx-0 mt-2 justify-content-between flex-grow-1 mb-fix">
              <div class="col-auto">
                <win-button block class="fw-bold px-3" :disabled="isLoading" @click="register">
                  {{ t('win.user_register.btn_register') }}
                </win-button>
              </div>
              <div class="col-auto">
                <win-button block class="px-3" @click="closeWindow(Win.USER_REGISTER)">
                  {{ t('buttons.cancel') }}
                </win-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>


    <div v-else-if="step === 2" class="text-center">
      <p class="lead">
        <em>{{ t('win.user_register.captcha_title') }}</em>
      </p>
      <p class="mt-2">
        {{ t('win.user_register.captcha_desc') }}
      </p>
      <div class="d-inline-block my-3">
        <vue-turnstile v-model="fields.captcha_response" :site-key="turnstileKey" />
      </div>
      <br>
      <win-button class="mx-auto px-4 fw-bold" @click="completeCaptcha">
        {{ t('buttons.continue') }}
      </win-button>
    </div>

    <!--        <template v-else>-->
    <!--          <p class="lead">Registration complete</p>-->
    <!--          <p class="my-2">Welcome to Nightwave Plaza, <strong>{{ fields.username }}</strong>!</p>-->
    <!--          <p>Now you use the like button.</p>-->
    <!--        </template>-->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VueTurnstile from 'vue-turnstile'
import { useWindows } from '@app/composables/useWindows.ts'
import { type UserRegisterForm, Win } from '@app/types'
import { useUserApi } from '@app/composables/api'


const { t } = useI18n()
const { showAlert, closeWindow } = useWindows()
const { registerUser } = useUserApi()
const { isLoading, fetch } = registerUser()
const turnstileKey = import.meta.env.VITE_TURNSTILE_KEY

const fields: UserRegisterForm = reactive({
  username: '',
  email: '',
  password: '',
  captcha_response: '',
})

const step = ref(1)
const passwordR = ref('')

/**
 * User register
 */
function register (): void {
  try {
    validate()
  } catch (e) {
    return showAlert((e as Error).message, t('errors.error'))
  }

  step.value = 2
}

function completeCaptcha (): void {
  if (fields.captcha_response === '') {
    step.value = 1
    return showAlert(t('win.user_register.captcha_fail'), t('errors.error'))
  }

  fetch(fields).then(() => {
    showAlert(
        t('win.user_register.welcome', { user: `<strong>${fields.username}</strong>` }),
        t('win.user_register.success'), 'info'
    )
    closeWindow(Win.USER_REGISTER)
  }).catch(e => {
    showAlert(e.message, t('errors.error'))
    step.value = 1
  })
}

/**
 * Fields validation
 */
function validate (): void {
  if (/[^a-zA-Z0-9-_]+/.test(fields.username)) {
    throw new Error(t('errors.fields.username_alphadash'))
  }

  if (fields.username.length < 4) {
    throw new Error(t('errors.fields.username_min'))
  }

  if (fields.username.length > 32) {
    throw new Error(t('errors.fields.username_max'))
  }

  if (fields.password!.length < 3) {
    throw new Error(t('errors.fields.password_min'))
  }

  if (fields.password !== passwordR.value) {
    throw new Error(t('errors.fields.password_match'))
  }
}
</script>

<style lang="scss">
#window-user-register {
  .img-register {
    width: 120px;
    height: auto;
    max-width: 100%;
  }

  button {
    margin-bottom: 2px;
  }

  p.lead {
    font-size: 14px !important;
    font-weight: 700;
  }

  .img-captcha {
    width: 100%;
    height: auto;
  }

  label[for=register-username]::first-letter,
  label[for=register-password]::first-letter,
  label[for=register-password-repeat]::first-letter,
  label[for=register-email]::first-letter {
    text-decoration: underline;
  }
}
</style>
