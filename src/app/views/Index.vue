<template>
  <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@app/stores/settingsStore'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindows } from '@app/composables/useWindows.ts'

const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const { openWindow, openedWindows, WinType } = useWindows()

onMounted(() => {
  openWindow(WinType.LOADING)

  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  }

  userAuthStore.loadUser()
})
</script>
