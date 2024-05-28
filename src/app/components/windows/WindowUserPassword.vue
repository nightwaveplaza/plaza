<template>
  <win-window v-slot="winProps" ref="win" :width="250" name="user-password" :title="t('win.user_password.title')">
    <div class="py-2">
      <div class="row no-gutters">
        <div class="col-10 offset-1">
          <!-- Current password -->
          <label for="current_password">{{ t('fields.current_password') }}:</label>
          <input id="current_password" v-model="fields.current_password" class="d-block mb-2" type="password">
          <!-- New password password -->
          <label for="password">{{ t('fields.new_password') }}:</label>
          <input id="password" v-model="fields.password" class="d-block mb-2" type="password">
          <!-- Repeat password -->
          <label for="password_repeat">{{ t('fields.repeat_password') }}:</label>
          <input id="password_repeat" v-model="passwordRepeat" class="d-block" type="password">

          <!-- Buttons -->
          <div class="row mt-2 no-gutters justify-content-between">
            <div class="col-6">
              <win-button block class="text-bold" :disabled="sending" @click="change">
                {{ t('buttons.change') }}
              </win-button>
            </div>
            <div class="col-4">
              <win-button block @click="winProps.close()">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { api } from '@app/api/api'
import { useI18n } from 'vue-i18n'
import { useWindowsStore } from '@app/stores/windowsStore'
import type { UserEdit } from '@app/types/types'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import WinWindow from '@app/components/basic/WinWindow.vue'

const { t } = useI18n()
const windowsStore = useWindowsStore()
const userAuthStore = useUserAuthStore()

const win = ref<InstanceType<typeof WinWindow>>()
const fields: UserEdit = reactive({
  current_password: '',
  password: '',
})
const passwordRepeat = ref('')
const sending = ref(false)

function change (): void {
  try {
    validate()
  } catch (e) {
    return windowsStore.alert((e as Error).message, t('errors.error'))
  }

  sending.value = true

  api.user.edit(fields).then(() => {
    userAuthStore.logout()
    windowsStore.alert(t('messages.password_changed'), t('messages.success'), 'info')
    win.value!.close()
  }).catch(e =>
      windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  ).finally(() => sending.value = false)
}

function validate (): void {
  if (fields.current_password.length === 0) {
    throw new Error(t('errors.enter_current_password'))
  }

  if (fields.password!.length < 3) {
    throw new Error(t('errors.password_short'))
  }

  if (fields.password !== passwordRepeat.value) {
    throw new Error(t('errors.passwords_match'))
  }
}
</script>
