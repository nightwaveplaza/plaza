<template>
  <div :class="settingsStore.themeName" :style="{backgroundColor}" class="app-desktop">
    <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />

    <win-taskbar />
    <native-watcher />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Native } from '@mobile/bridge/native'
import { useSettingsStore } from '@app/stores/settingsStore'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { enBackgroundMode } from '@app/types/types'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'

const i18n = useI18n()
const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const { openWindow, WinType, openedWindows } = useWindows()

watch(() => settingsStore.language, () => {
  i18n.locale.value = settingsStore.language
})

const backgroundColor = computed(() => {
  return settingsStore.background.mode === enBackgroundMode.SOLID ? settingsStore.background.color : 'transparent'
})

onMounted(() => {
  settingsStore.loadSettings()

  openWindow(WinType.LOADING)

  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  }

  Native.getAuthToken()!.then(t => {
    userAuthStore.token = t as string
    userAuthStore.loadUser()
  })

  Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)

})
</script>
