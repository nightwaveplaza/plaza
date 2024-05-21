<template>
  <win-window ref="win" :width="250" name="user-email" :title="t('win.user_email.title')" v-slot="winProps">
    <div class="py-2 px-3">
      <!-- Email -->
      <label for="email">{{ t('win.user_email.email') }}:</label>
      <input id="email" :disabled="disabled" v-model="fields.email" class="d-block mb-2" type="email"/>

      <!-- Current password -->
      <label for="password">{{ t('win.user_email.password') }}:</label>
      <input id="password" :disabled="disabled" v-model="fields.current_password" class="d-block mb-2" type="password"/>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-btn block class="text-bold" @click="update">{{ t('buttons.change') }}</win-btn>
        </div>
        <div class="col-4">
          <win-btn block @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { api } from '@common/js/api/api'
import { onMounted, reactive, ref } from 'vue'
import type { UserEdit } from '@common/js/types'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const windowsStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()
const fields: UserEdit = reactive({
  current_password: '',
  email: '',
})
const disabled = ref(true)

// Non-reactive
let sending = false

function fetchUser () {
  api.user.get().then(res => {
    fields.email = res.data.email
    disabled.value = false
  }).catch(() => {
    windowsStore.alert(t('alerts.user_fetch_error.message'), t('alerts.user_fetch_error.title'))
    win.value!.close()
  })
}

function update () {
  if (!validate() || sending) {
    return
  }

  sending = true

  api.user.edit(fields).then(() => {
    windowsStore.alert(
        t('alerts.email_changed.message'),
        t('alerts.email_changed.title'),
        'info'
    )
    win.value!.close()
  }).catch(e => {
    windowsStore.alert(
        t('alerts.error.message', {error: (e as Error).message}),
        t('alerts.error.title')
    )
  }).finally(() => {
    sending = false
  })
}

function validate () {
  if (fields.current_password.length === 0) {
    windowsStore.alert(
        t('alerts.enter_password.message'),
        t('alerts.enter_password.title'),
        'info'
    )
    return false
  }

  return true
}

onMounted(() => {
  fetchUser()
})
</script>
