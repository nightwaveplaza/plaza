<template>
  <win-window ref="win" :width="480" name="user-login" :title="t('win.user_login.title')" v-slot="winProps">
    <div class="noselect">
      <div class="row no-gutters p-2">
        <div class="col-12 d-block d-sm-none mb-3 p-0">{{ t('win.user_login.type_username') }}</div>

        <div class="col-auto d-none d-sm-block pr-3">
          <img alt="" class="img-key" height="48" src="@common/img/key.png" width="45"/>
        </div>

        <div class="col pl-0 pr-2">
          <div class="row no-gutters d-none d-sm-block mb-2">
            <div class="col-12">{{ t('win.user_login.type_username') }}</div>
          </div>

          <!-- Username -->
          <div class="row no-gutters">
            <div class="col-8 col-sm-3 align-self-center">
              <label class="mt-0" for="username">{{ t('fields.username') }}:</label>
            </div>
            <div class="col-8 col-sm-6">
              <input id="username" v-model="fields.username" class="mr-0 ml-0 w-100" type="text"/>
            </div>
          </div>

          <!-- Password -->
          <div class="row mt-1 no-gutters">
            <div class="col-8 col-sm-3 align-self-center">
              <label class="mt-0" for="password">{{ t('fields.password') }}:</label>
            </div>
            <div class="col-8 col-sm-6">
              <input id="password" v-model="fields.password" class="mr-0 ml-0 w-100" type="password"/>
            </div>
            <div class="col-2 col-sm-2 ml-2 align-self-center">
              <a role="button" @click="openReset">{{ t('win.user_login.btn_reset') }}</a>
            </div>
          </div>

          <!-- Remember -->
          <div class="row mt-1 no-gutters justify-content-end" v-if="!isMobile">
            <div class="col-12 col-sm-9">
              <div class="checkbox">
                <input id="remember" v-model="remember" type="checkbox"/>
                <label for="remember">{{ t('win.user_login.remember_me') }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-auto col-sm-2 p-0 login-buttons">
          <win-btn class="mb-2 text-bold" @click="login" :disabled="sending">{{ t('win.user_login.btn_sign_in') }}</win-btn>
          <win-btn class="mb-2" @click="openRegister">{{ t('win.user_login.btn_register') }}</win-btn>
          <win-btn @click="winProps.close()">{{ t('buttons.cancel') }}</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import type { UserLogin } from '@common/js/types'

const { t } = useI18n()
const { isMobile } = helperComposable()

const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()

const fields: UserLogin = reactive({
  username: '',
  password: '',
})
const remember = ref(false)

const sending = ref<Boolean>(false)

function login () {
  if (fields.username.length === 0 || fields.password.length === 0) {
    windowsStore.alert(t('errors.enter_user_pass'), t('errors.error'))
    return false
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

function openRegister () {
  windowsStore.open('user-register')
  win.value!.close()
}

function openReset () {
  windowsStore.open('user-reset')
  win.value!.close()
}
</script>
