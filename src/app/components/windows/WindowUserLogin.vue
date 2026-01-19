<template>
  <div class="noselect">
    <div class="row gx-0 p-2">
      <div class="col-12 d-block d-sm-none mb-3 p-0">
        {{ t('win.user_login.type_username') }}
      </div>

      <div class="col-auto d-none d-sm-block pe-3">
        <img alt="" class="img-key" height="48" src="@app/assets/img/key.png" width="45">
      </div>

      <div class="col ps-0 pe-2">
        <div class="row gx-0 d-none d-sm-block mb-2">
          <div class="col-12">
            {{ t('win.user_login.type_username') }}
          </div>
        </div>

        <!-- Username -->
        <div class="row gx-0">
          <div class="col-8 col-sm-4 align-self-center">
            <label class="mt-0" for="username">{{ t('fields.username') }}:</label>
          </div>
          <div class="col-8 col-sm-5">
            <input id="username" v-model="fields.username" class="me-0 ms-0 w-100" type="text">
          </div>
        </div>

        <!-- Password -->
        <div class="row mt-1 gx-0">
          <div class="col-8 col-sm-4 align-self-center">
            <label class="mt-0" for="password">{{ t('fields.password') }}:</label>
          </div>
          <div class="col-8 col-sm-5">
            <input id="password" v-model="fields.password" class="me-0 ms-0 w-100" type="password">
          </div>
          <div class="col-2 col-sm-2 ms-2 align-self-center">
            <a role="button" @click="openReset">{{ t('win.user_login.btn_reset') }}</a>
          </div>
        </div>

        <!-- Remember -->
        <div v-if="!isMobile()" class="row mt-1 gx-0 justify-content-end">
          <div class="col-12 col-sm-8">
            <div class="checkbox">
              <input id="remember" v-model="fields.remember" type="checkbox">
              <label for="remember">{{ t('win.user_login.remember_me') }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="col-auto col-sm-2 p-0 login-buttons">
        <win-button :disabled="isLoading" class="mb-2 fw-bold" @click="login">
          {{ t('win.user_login.btn_sign_in') }}
        </win-button>
        <win-button class="mb-2" @click="openRegister">
          {{ t('win.user_login.btn_register') }}
        </win-button>
        <win-button @click="closeWindow(Win.USER_LOGIN)">
          {{ t('buttons.cancel') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { isMobile } from '@app/utils/helpers.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { type UserLoginForm, Win } from '@app/types'
import { useAuthApi } from '@app/composables/api'
import { useAuth } from '@app/composables/useAuth.ts'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'

const { t } = useI18n()
const { openWindow, closeWindow, showAlert } = useWindows()
const { login: loginApi,  token: tokenApi } = useAuthApi()
const { setUser } = useAuth()
const { setToken } = useAuthToken()
const { fetch, isLoading } = isMobile() ? tokenApi() : loginApi()

const fields: UserLoginForm = reactive({
  username: '',
  password: '',
  remember: false
})

function login (): void {
  if (fields.username.length === 0 || fields.password.length === 0) {
    return showAlert(t('errors.enter_user_pass'), t('errors.error'))
  }

  fetch(fields).then(res => {
    setUser(res.data)
    if (res.token) {
      setToken(res.token)
    }
    showAlert(t('messages.auth_success'), t('messages.success'), 'info')
    closeWindow(Win.USER_LOGIN)
  }).catch(e => {
    showAlert(e.message, t('errors.error'))
  })
}

function openRegister (): void {
  openWindow(Win.USER_REGISTER)
  closeWindow(Win.USER_LOGIN)
}

function openReset (): void {
  openWindow(Win.USER_RESET)
  closeWindow(Win.USER_LOGIN)
}
</script>

<style lang="scss">
#window-user-login {
  .img-key {
    margin-top: 2px;
    width: 45px;
    height: 48px;
  }

  .login-buttons button {
    width: 76px;
    display: block;
  }

  label[for=username]::first-letter, label[for=password]::first-letter {
    text-decoration: underline;
  }
}
</style>
