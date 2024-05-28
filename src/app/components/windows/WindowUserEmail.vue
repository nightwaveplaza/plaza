<template>
  <win-window ref="win" v-slot="winProps" :width="250" name="user-email" :title="t('win.user_email.title')">
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
          <win-button block :disabled="sending" class="text-bold" @click="update">
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
import { api } from '@app/api/api'
import { onMounted, reactive, ref } from 'vue'
import type { UserEdit } from '@app/types/types'
import { useWindowsStore } from '@app/stores/windowsStore'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const windowsStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()
const fields: UserEdit = reactive({
  current_password: '',
  email: '',
})
const disabled = ref(true)
const sending = ref(false)

function fetchUser (): void {
  api.user.get().then(res => {
    fields.email = res.data.email
    disabled.value = false
  }).catch(() => {
    windowsStore.alert(t('errors.user_fetch'), t('errors.error'))
    win.value!.close()
  })
}

function update (): void {
  if (fields.current_password.length === 0) {
    return windowsStore.alert(t('errors.enter_current_password'), t('errors.error'))
  }

  sending.value = true

  api.user.edit(fields).then(() => {
    windowsStore.alert(t('messages.email_changed'), t('messages.success'), 'info')
    win.value!.close()
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  }).finally(() => {
    sending.value = false
  })
}

onMounted(() => {
  fetchUser()
})
</script>
