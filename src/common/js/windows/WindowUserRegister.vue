<template>
  <win-window ref="win" :width="430" name="user-register" :title="t('win.user_register.title')">
    <div class="p-2 noselect">
      <template v-if="step === 1">
        <div class="row no-gutters">
          <div class="col-sm-4 d-none d-sm-block">
            <img alt="register" class="img-register" src="@common/img/register.png"/>
          </div>

          <div class="col-12 col-sm-8 d-flex flex-column">
            <div class="d-flex flex-grow-1 flex-column mb-fix">
              <p class="lead">{{ t('win.user_register.user_information') }}:</p>
              <p class="mt-2 mb-3">{{ t('win.user_register.please_fill') }}</p>

              <!-- Username -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-username">{{ t('win.user_register.username') }}:</label>
                </div>
                <div class="col-7">
                  <input id="register-username" v-model="fields.username" class="d-block m-0" tabindex="1" type="text"/>
                </div>
              </div>

              <!-- Password -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-password">{{ t('win.user_register.password') }}:</label>
                </div>
                <div class="col-7">
                  <input id="register-password" v-model="fields.password" class="d-block m-0" tabindex="2"
                         type="password"/>
                </div>
              </div>

              <!-- Password repeat -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-password-repeat">{{ t('win.user_register.password_repeat') }}:</label>
                </div>
                <div class="col-7">
                  <input id="register-password-repeat" v-model="passwordR" class="d-block m-0" tabindex="3"
                         type="password"/>
                </div>
              </div>

              <!-- Email -->
              <div class="row no-gutters mb-2">
                <div class="col-5 align-self-center">
                  <label for="register-email">{{ t('win.user_register.email') }}:</label>
                </div>
                <div class="col-7">
                  <input id="register-email" v-model="fields.email" class="d-block m-0" tabindex="4" type="email"/>
                </div>
              </div>
            </div>

            <div class="d-flex flex-grow-0">
              <div class="row no-gutters mt-2 justify-content-between flex-grow-1 mb-fix">
                <div class="col-4">
                  <win-btn block class="text-bold" @click="register" :disabled="sending">{{ t('win.user_register.register') }}</win-btn>
                </div>
                <div class="col-4">
                  <win-btn block @click="close">{{ t('buttons.cancel') }}</win-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>


      <div class="text-center" v-else-if="step === 2">
        <p class="lead"><em>{{ t('win.user_register.captcha_title') }}</em></p>
        <p class="mt-2">{{ t('win.user_register.captcha_desc') }}</p>
        <div class="d-inline-block my-3">
          <vue-turnstile site-key="0x4AAAAAAAJlKRFzqmHHqPtK" v-model="fields.captcha_response"/>
        </div>
        <br/>
        <win-btn @click="completeCaptcha" class="mx-auto px-4 text-bold">{{ t('buttons.continue') }}</win-btn>
      </div>

      <!--        <template v-else>-->
      <!--          <p class="lead">Registration complete</p>-->
      <!--          <p class="my-2">Welcome to Nightwave Plaza, <strong>{{ fields.username }}</strong>!</p>-->
      <!--          <p>Now you use the like button.</p>-->
      <!--        </template>-->
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import VueTurnstile from 'vue-turnstile'
import WinWindow from '@common/js/components/WinWindow.vue'
import type { UserRegister } from '@common/js/types'

const { t } = useI18n()
const router = useRouter()
const windowsStore = useWindowsStore()

const props = withDefaults(defineProps<{
  direct: boolean
}>(), {
  direct: false
})

const fields: UserRegister = reactive({
  username: '',
  email: '',
  password: '',
  captcha_response: '',
})
const step = ref(1)
const passwordR = ref('')
const sending = ref(false)

const win = ref<InstanceType<typeof WinWindow>>()

/**
 * User register
 */
function register () {
  try {
    validate()
  } catch (e) {
    return windowsStore.alert((e as Error).message, t('errors.error'))
  }

  step.value = 2
}

function completeCaptcha () {
  if (fields.captcha_response === '') {
    step.value = 1
    return windowsStore.alert(t('win.user_register.captcha_fail'), t('errors.error'))
  }

  sending.value = true

  api.user.register(fields).then(() => {
    windowsStore.alert(
        t('win.user_register.welcome', {user:`<strong>${fields.username}</strong>`}),
        t('win.user_register.success'), 'info'
    )
    win.value!.close()
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
    step.value = 1
  }).finally(() => sending.value = false)
}

/**
 * Fields validation
 */
function validate () {
  if (/[^a-zA-Z0-9-_]+/.test(fields.username)) {
    throw new Error(t('errors.username_incorrect'))
  }

  if (fields.username.length < 4) {
    throw new Error(t('errors.username_short'))
  }

  if (fields.username.length > 32) {
    throw new Error(t('errors.username_long'))
  }

  if (fields.password!.length < 3) {
    throw new Error(t('errors.password_short'))
  }

  if (fields.password !== passwordR.value) {
    throw new Error(t('errors.passwords_match'))
  }

  if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(fields.email)) {
    throw new Error(t('errors.email_incorrect'))
  }
}

function close () {
  if (props.direct) {
    router.push({ name: 'index' })
  } else {
    win.value!.close()
  }
}
</script>
