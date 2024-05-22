<template>
  <win-window ref="win" name="user-reset-password" title="Reset password" :width="280">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- New password -->
          <label for="password">{{ t('win.user_password.new') }}:</label>
          <input class="d-block mb-2" id="password" type="password" v-model="password"/>

          <!-- Repeat password -->
          <label for="password_repeat">{{ t('win.user_password.repeat') }}:</label>
          <input class="d-block" id="password_repeat" type="password" v-model="passwordRepeat"/>

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-btn block @click="change" class="text-bold">{{ t('buttons.change') }}</win-btn>
            </div>
            <div class="col-4">
              <win-btn block @click="router.push({name: 'index'})">{{ t('buttons.cancel') }}</win-btn>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
const sending = ref(false)

function change () {
  try {
    validate()
  } catch (e) {
    return windowsStore.alert((e as Error).message, t('errors.error'))
  }

  sending.value = true

  api.user.confirmReset({ token: props.token, password: password.value }).then(() => {
    windowsStore.alert(t('messages.password_changed'), t('messages.success'), 'info')
    win.value!.close()
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  }).finally(() => sending.value = false)
}

function validate () {
  if (password.value.length < 3) {
    throw new Error(t('errors.password_short'))
  }

  if (password.value !== passwordRepeat.value) {
    throw new Error(t('errors.passwords_match'))
  }
}
</script>
