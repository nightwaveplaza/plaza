<template>
  <win-menu class="text-right">
    <win-menu-action @click="open(Win.USER_PROFILE_DELETE)">
      {{ t('win.user_profile_delete.title') }}
    </win-menu-action>
  </win-menu>

  <div class="py-2 px-2">
    <win-group-box class="mb-3">
      <template #title>
        {{ t('fields.user_details') }}
      </template>
      <template #content>
        <!-- Username -->
        <label for="username" class="noselect">{{ t('fields.username') }}:</label>
        <input id="username" v-model="fields.username" class="d-block mb-2" type="text">

        <!-- Email -->
        <label for="email" class="noselect">{{ t('fields.email') }}:</label>
        <input id="email" v-model="fields.email" class="d-block" type="email">
      </template>
    </win-group-box>

    <win-panel class="mb-3">
      <!-- Current password -->
      <label for="password" class="noselect">{{ t('fields.current_password') }}:</label>
      <input id="password" v-model="fields.current_password" class="d-block" type="password">
    </win-panel>

    <!-- Buttons -->
    <div class="row mt-3 no-gutters justify-content-between">
      <div class="col-6">
        <win-button block :disabled="isLoading" class="text-bold" @click="update">
          {{ t('buttons.save') }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button block @click="closeWindow(Win.USER_PROFILE_EDIT)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useUserApi } from '@app/composables/api'
import { type UserProfileForm, Win } from '@app/types'
import { useAuth } from '@app/composables/useAuth.ts'

const { t } = useI18n()
const { showAlert, closeWindow, openWindow } = useWindows()
const { updateProfile } = useUserApi()
const { user, setUser } = useAuth()
const { isLoading } = updateProfile()

const fields: UserProfileForm = reactive({
  current_password: '',
  email: '',
  username: ''
})

function fetchUser (): void {
  fields.email = user.value?.email ?? ''
  fields.username = user.value?.username ?? ''
}

function update (): void {
  if (fields.current_password.length === 0) {
    return showAlert(t('errors.fields.current_password_required'), t('errors.error'))
  }

  updateProfile().fetch(fields).then(res => {
    showAlert(t('messages.profile_updated'), t('messages.success'), 'info')
    setUser(res.data)
    closeWindow(Win.USER_PROFILE_EDIT)
  }).catch(e => {
    showAlert(e.message, t('errors.error'))
  })
}

function open (window: Win): void {
  openWindow(window)
  closeWindow(Win.USER_PROFILE_EDIT)
}

onMounted(() => {
  fetchUser()
})
</script>
