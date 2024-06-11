<template>
  <win-window v-slot="winProps" ref="win" :width="480" name="user-login" :title="t('win.user_login.title')">
    <div class="noselect">
      <div class="row no-gutters p-2">
        <div class="col-12 d-block d-sm-none mb-3 p-0">
          {{ t('win.user_login.type_username') }}
        </div>

        <div class="col-auto d-none d-sm-block pr-3">
          <img alt="" class="img-key" height="48" src="@app/assets/img/key.png" width="45">
        </div>

        <div class="col pl-0 pr-2">
          <div class="row no-gutters d-none d-sm-block mb-2">
            <div class="col-12">
              {{ t('win.user_login.type_username') }}
            </div>
          </div>

          <!-- Username -->
          <div class="row no-gutters">
            <div class="col-8 col-sm-4 align-self-center">
              <label class="mt-0" for="username">{{ t('fields.username') }}:</label>
            </div>
            <div class="col-8 col-sm-5">
              <input id="username" v-model="fields.username" class="mr-0 ml-0 w-100" type="text">
            </div>
          </div>

          <!-- Password -->
          <div class="row mt-1 no-gutters">
            <div class="col-8 col-sm-4 align-self-center">
              <label class="mt-0" for="password">{{ t('fields.password') }}:</label>
            </div>
            <div class="col-8 col-sm-5">
              <input id="password" v-model="fields.password" class="mr-0 ml-0 w-100" type="password">
            </div>
            <div class="col-2 col-sm-2 ml-2 align-self-center">
              <a role="button" @click="openReset">{{ t('win.user_login.btn_reset') }}</a>
            </div>
          </div>

          <!-- Remember -->
          <div v-if="!useMobile()" class="row mt-1 no-gutters justify-content-end">
            <div class="col-12 col-sm-8">
              <div class="checkbox">
                <input id="remember" v-model="remember" type="checkbox">
                <label for="remember">{{ t('win.user_login.remember_me') }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-auto col-sm-2 p-0 login-buttons">
          <win-button :disabled="sending" class="mb-2 text-bold" @click="login">
            {{ t('win.user_login.btn_sign_in') }}
          </win-button>
          <win-button class="mb-2" @click="openRegister">
            {{ t('win.user_login.btn_register') }}
          </win-button>
          <win-button @click="winProps.close()">
            {{ t('buttons.cancel') }}
          </win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@app/api/api'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import WinWindow from '@app/components/basic/WinWindow.vue'
import type { UserLogin } from '@app/types/types'
import { useMobile } from '@app/composables/useMobile.ts'

const { t } = useI18n()

const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()

const fields: UserLogin = reactive({
  username: '',
  password: '',
})
const remember = ref(false)

const sending = ref<boolean>(false)

function login (): void {
  if (fields.username.length === 0 || fields.password.length === 0) {
    return windowsStore.alert(t('errors.enter_user_pass'), t('errors.error'))
  }

  sending.value = true

  api.user.login(fields).then(res => {
    userAuthStore.login(res.data, remember.value)
    windowsStore.alert(t('messages.auth_success'), t('messages.success'), 'info')
    win.value!.close()
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  }).finally(() => sending.value = false)
}

function openRegister (): void {
  windowsStore.open('user-register')
  win.value!.close()
}

function openReset (): void {
  windowsStore.open('user-reset')
  win.value!.close()
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
