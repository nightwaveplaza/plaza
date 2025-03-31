<template>
  <win-window v-slot="winProps" :width="220" :name="name" :title="t('win.user.title')">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-button v-if="!isMobile()" block class="mb-2" @click="open(WinType.USER_FAVORITES)">
            {{ t('win.user_favorites.title') }}
          </win-button>
          <win-button block class="mb-2" @click="open(WinType.USER_EMAIL)">
            {{ t('win.user_email.title') }}
          </win-button>
          <win-button block class="mb-2" @click="open(WinType.USER_PASSWORD)">
            {{ t('win.user_password.title') }}
          </win-button>
          <win-button block class="mb-2" @click="logout">
            {{ t('win.user.btn_logout') }}
          </win-button>
          <win-button block class="close mt-2 mx-auto" @click="winProps.close()">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { isMobile } from '@app/utils/helpers.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuthApi } from '@app/composables/api/useAuthApi.ts'

const { t } = useI18n()
const { openWindow, closeWindow, WinType } = useWindows()
const { logout: logoutApi } = useAuthApi()
const userAuthStore = useUserAuthStore()

defineProps<{
  name: string,
}>()

function open (window: string): void {
  openWindow(window)
  closeWindow(WinType.USER)
}

function logout (): void {
  logoutApi().fetch().then().finally(() => {
    userAuthStore.logout()
    closeWindow(WinType.USER)
  })
}
</script>
