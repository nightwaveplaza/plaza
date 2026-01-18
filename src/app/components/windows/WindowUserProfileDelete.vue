<template>
  <div class="p-2">
    <win-memo class="mb-2">
      <p><b>{{ t('win.user_profile_delete.warn1') }}</b></p>
      <p>{{ t('win.user_profile_delete.warn2') }}</p>
      <p>{{ t('win.user_profile_delete.warn3') }}</p>
      <p>{{ t('win.user_profile_delete.warn4') }}</p>
      <p>{{ t('win.user_profile_delete.warn5') }}</p>
    </win-memo>

    <div class="checkbox mb-3">
      <input id="remember" v-model="deleteConfirm" type="checkbox">
      <label for="remember">{{ t('win.user_profile_delete.understand') }}</label>
    </div>

    <win-panel class="mb-3">
      <label for="password" class="noselect">{{ t('fields.current_password') }}:</label>
      <input id="password" v-model="fields.current_password" class="d-block" type="password">
    </win-panel>

    <!-- Buttons -->
    <div class="row mt-3 no-gutters justify-content-between">
      <div class="col-6">
        <win-button block :disabled="isLoading" class="text-bold" @click="deleteAccount">
          {{ t('win.user_profile_delete.title') }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button block @click="closeWindow(Win.USER_PROFILE_DELETE)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserApi } from '@app/composables/api'
import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'
import { useAuth } from '@app/composables/useAuth.ts'

const { t } = useI18n()
const { deleteProfile } = useUserApi()
const { isLoading } = deleteProfile()
const { showAlert, closeWindow } = useWindows()
const { unsetUser } = useAuth()

const fields = reactive({
  current_password: '',
})

const deleteConfirm = ref(false)

function deleteAccount(): void {
  if (deleteConfirm.value === false) {
    return showAlert(t('errors.fields.delete_confirm_required'), t('errors.error'))
  }

  if (fields.current_password.length === 0) {
    return showAlert(t('errors.fields.current_password_required'), t('errors.error'))
  }

  deleteProfile().fetch(fields).then(() => {
    showAlert(t('messages.profile_deleted'), t('messages.success'), 'info')
    unsetUser()
    closeWindow(Win.USER_PROFILE_DELETE)
  }).catch(e => {
    showAlert(e.message, t('errors.error'))
  })
}
</script>
