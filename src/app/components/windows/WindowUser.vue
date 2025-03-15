<template>
  <win-window v-slot="winProps" :width="220" :name="name" :title="t('win.user.title')">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-button v-if="!useMobile()" block class="mb-2" @click="open(WinType.USER_FAVORITES)">
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
import { api } from '@app/api/api'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import { useMobile } from '@app/composables/useMobile.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { WinType } from '@app/types/types.ts'

const { t } = useI18n()
const { openWindow } = useWindows()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

defineProps<{
  name: string,
}>()

function open (window: WinType): void {
  openWindow(window)
  windowsStore.close(WinType.USER)
}

function logout (): void {
  api.user.logout().then().finally(() => {
    userAuthStore.logout()
    windowsStore.close(WinType.USER)
  })
}
</script>
