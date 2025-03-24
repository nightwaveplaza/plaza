<template>
  <div :class="themeName" :style="{backgroundColor}" class="app-desktop">
    <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />

    <win-taskbar />
    <native-watcher />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Native } from '@mobile/bridge/native'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { useBackgrounds } from '@app/composables/useBackgrounds.ts'
import { useStatusUpdater } from '@app/composables/player/useStatusUpdater.ts'

const i18n = useI18n()
const userAuthStore = useUserAuthStore()
const { openWindow, WinType, openedWindows } = useWindows()
const { themeName, language } = useAppSettings()
const { fetch: fetchBackgrounds, backgroundColor, isRandomMode, setRandomBackground } = useBackgrounds()

// Run status updater
useStatusUpdater()

watch(() => language.value, () => {
  i18n.locale.value = language.value
})

onMounted(() => {
  // todo
  i18n.locale.value = language.value

  openWindow(WinType.LOADING)

  if (isRandomMode.value) {
    fetchBackgrounds().then(() => setRandomBackground())
  }

  Native.getAuthToken()!.then(t => {
    userAuthStore.token = t as string
    userAuthStore.loadUser()
  })

  Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)

})
</script>
