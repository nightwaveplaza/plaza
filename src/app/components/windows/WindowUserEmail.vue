<template>
  <win-window ref="win" v-slot="winProps" :width="250" :name="name" :title="t('win.user_email.title')">
    <div class="py-2 px-3">
      <!-- Email -->
      <label for="email">{{ t('fields.email') }}:</label>
      <input id="email" v-model="fields.email" :disabled="disabled" class="d-block mb-2" type="email">

      <!-- Current password -->
      <label for="password">{{ t('fields.current_password') }}:</label>
      <input id="password" v-model="fields.current_password" :disabled="disabled" class="d-block mb-2" type="password">

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-button block :disabled="isLoading" class="text-bold" @click="changeEmail">
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
  </win-window>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useI18n } from 'vue-i18n'
import { useWindows, WinType } from '@app/composables/useWindows.ts'
import { useUserApi } from '@app/composables/api/useUserApi.ts'
import type { UserEmailForm } from '@app/types'

const { t } = useI18n()
const { winAlert, closeWindow } = useWindows()
const { getUser, updateEmail } = useUserApi()
const { isLoading, fetch: update } = updateEmail()

defineProps<{
  name: string,
}>()

const fields: UserEmailForm = reactive({
  current_password: '',
  email: '',
})
const disabled = ref(true)

function fetchUser (): void {
  getUser().fetch().then(res => {
    fields.email = res.data.email
    disabled.value = false
  }).catch(() => {
    winAlert(t('errors.user_fetch'), t('errors.error'))
    closeWindow(WinType.USER_EMAIL)
  })
}

function changeEmail (): void {
  if (fields.current_password.length === 0) {
    return winAlert(t('errors.fields.current_password_required'), t('errors.error'))
  }

  update(fields).then(() => {
    winAlert(t('messages.email_changed'), t('messages.success'), 'info')
    closeWindow(WinType.USER_EMAIL)
  }).catch(e => {
    winAlert(e.message, t('errors.error'))
  })
}

onMounted(() => {
  fetchUser()
})
</script>
