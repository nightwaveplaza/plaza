<template>
  <win-window ref="win" v-slot="winProps" :width="320" :name="name" :title="t('win.user_profile_delete.title')">
    <div class="p-2">
      <win-memo class="mb-3">
        <p><b>{{ t('win.user_profile_delete.warn1') }}</b></p>
        <p>{{ t('win.user_profile_delete.warn2') }}</p>
        <p>{{ t('win.user_profile_delete.warn3') }}</p>
        <p>{{ t('win.user_profile_delete.warn4') }}</p>
        <p>{{ t('win.user_profile_delete.warn5') }}</p>
      </win-memo>

      <win-group-box class="mb-3">
        <template #title>
          {{ t('win.user_profile_delete.confirm') }}
        </template>
        <template #content>
          <div class="checkbox">
            <input id="remember" v-model="deleteConfirm" type="checkbox">
            <label for="remember">{{ t('win.user_profile_delete.understand') }}</label>
          </div>
        </template>
      </win-group-box>


      <win-group-box class="mb-3">
        <template #title>
          {{ t('fields.password_confirmation') }}
        </template>
        <template #content>
          <!-- Current password -->
          <label for="password" class="noselect">{{ t('fields.current_password') }}:</label>
          <input id="password" v-model="fields.current_password" class="d-block" type="password">
        </template>
      </win-group-box>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-button block :disabled="isLoading" class="text-bold" @click="deleteAccount">
            {{ t('win.user_profile_delete.title') }}
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
import { reactive, ref } from 'vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useI18n } from 'vue-i18n'
import { useUserApi } from '@app/composables/api'
import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'
import { useAuth } from '@app/composables/useAuth.ts'

const { t } = useI18n()
const { deleteProfile } = useUserApi()
const { isLoading } = deleteProfile()
const { winAlert, closeWindow } = useWindows()
const { unsetUser } = useAuth()

const fields = reactive({
  current_password: '',
})

const deleteConfirm = ref(false)

function deleteAccount() {
  if (deleteConfirm.value === false) {
    return winAlert(t('errors.fields.delete_confirm_required'), t('errors.error'))
  }

  if (fields.current_password.length === 0) {
    return winAlert(t('errors.fields.current_password_required'), t('errors.error'))
  }

  deleteProfile().fetch(fields).then(() => {
    winAlert(t('messages.profile_deleted'), t('messages.success'), 'info')
    unsetUser()
    closeWindow(Win.USER_PROFILE_DELETE)
  }).catch(e => {
    winAlert(e.message, t('errors.error'))
  })
}

</script>
