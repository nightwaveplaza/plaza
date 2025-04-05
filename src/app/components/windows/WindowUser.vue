<template>
  <win-window v-slot="winProps" :width="220" :name="name" :title="t('win.user.title')">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-button v-if="!isMobile()" block class="mb-2" @click="open(Win.USER_FAVORITES)">
            {{ t('win.user_favorites.title') }}
          </win-button>
          <win-button block class="mb-2" @click="open(Win.USER_EMAIL)">
            {{ t('win.user_email.title') }}
          </win-button>
          <win-button block class="mb-2" @click="open(Win.USER_PASSWORD)">
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
import { isMobile } from '@app/utils/helpers.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuthApi } from '@app/composables/api'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'

const { t } = useI18n()
const { openWindow, closeWindow } = useWindows()
const { logout: logoutApi } = useAuthApi()
const { unsetUser } = useAuth()

defineProps<{
  name: string,
}>()

function open (window: string): void {
  openWindow(window)
  closeWindow(Win.USER)
}

function logout (): void {
  logoutApi().fetch().then().finally(() => {
    unsetUser()
    closeWindow(Win.USER)
  })
}
</script>
