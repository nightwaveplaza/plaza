<template>
  <win-window v-slot="winProps" :width="220" name="user" :title="t('win.user.title')">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-button v-if="!isMobile" block class="mb-2" @click="open('user-favorites')">
            {{ t('win.user_favorites.title') }}
          </win-button>
          <win-button block class="mb-2" @click="open('user-email')">
            {{ t('win.user_email.title') }}
          </win-button>
          <win-button block class="mb-2" @click="open('user-password')">
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
import helperComposable from '@app/composables/helperComposable'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'

const { t } = useI18n()
const { isMobile } = helperComposable()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

function open (window: string): void {
  windowsStore.open(window)
  windowsStore.close('user')
}

function logout (): void {
  api.user.logout().then().finally(() => {
    userAuthStore.logout()
    windowsStore.close('user')
  })
}
</script>
