<template>
  <win-window v-slot="{ close }" :width="290" :name="name" :title="t('win.user.title')">
    <win-menu class="mb-1">
      <win-menu-action @click="open(Win.USER_PROFILE_EDIT)">
        {{ t('win.user_profile_edit.title') }}
      </win-menu-action>
      <win-menu-action @click="open(Win.USER_PASSWORD)">
        {{ t('win.user_password.title') }}
      </win-menu-action>
      <win-menu-action @click="logout">
        {{ t('win.user.btn_logout') }}
      </win-menu-action>
    </win-menu>

    <div class="p-2">
      <win-panel class="p-2 mb-2">
        <div class="row no-gutters">
          <div class="col-2 align-self-center noselect">
            <img src="@app/assets/img/user_card.png" alt="user">
          </div>
          <div class="col pl-2">
            <div class="username mb-1">
              {{ user?.username }}
            </div>
            <div class="text-muted">
              {{ user?.email }}
            </div>
          </div>
        </div>
      </win-panel>

      <div class="row no-gutters mb-3">
        <div class="col">
          <win-group-box>
            <template #title>
              {{ t('win.user.statistics') }}
            </template>
            <template #content>
              <table style="width: 100%;">
                <colgroup>
                  <col style="width: 75px">
                  <col style="width: auto">
                </colgroup>
                <tbody>
                  <tr>
                    <td><b>{{ t('win.user.likes') }}:</b></td>
                    <td>{{ reactions ?? '...' }}</td>
                  </tr>
                  <tr>
                    <td><b>{{ t('win.user.favorites') }}:</b></td>
                    <td>{{ favorites ?? '...' }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
          </win-group-box>
        </div>
        <div class="col pl-2">
          <win-group-box>
            <template #title>
              {{ t('win.user.account') }}
            </template>
            <template #content>
              <table>
                <tr>
                  <td><b>{{ t('win.user.registered') }}:</b></td>
                </tr>
                <tr>
                  <td>{{ fmtDate(user?.created_at ?? 0) }}</td>
                </tr>
              </table>
            </template>
          </win-group-box>
        </div>
      </div>

      <div class="row noselect justify-content-between">
        <div class="col">
          <win-button class="px-3" @click="openWindow(Win.USER_FAVORITES)">
            {{ t('win.user_favorites.title') }}
          </win-button>
        </div>
        <div class="col-4">
          <win-button block @click="close()">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { fmtDate } from '@app/utils/timeFormats.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAuthApi, useUserApi } from '@app/composables/api'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const { openWindow, closeWindow } = useWindows()
const { logout: logoutApi } = useAuthApi()
const { user, unsetUser } = useAuth()
const { getUserStats } = useUserApi()

const reactions = ref<number|null>(null)
const favorites = ref<number|null>(null)

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

onMounted(() => {
  getUserStats().fetch().then(res => {
    reactions.value = res.data.reactions
    favorites.value = res.data.favorites
  }).catch(() => {

  })
})
</script>

<style lang="scss">
#window-user {
  .username {
    font-size: 14px;
    font-weight: 700;
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
