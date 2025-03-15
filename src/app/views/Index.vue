<template>
  <div class="app-desktop" :class="settingsStore.themeName" :style="{backgroundImage, backgroundColor}">
    <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />

    <win-taskbar />
    <win-status-bar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '@app/stores/settingsStore'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindows } from '@app/composables/useWindows.ts'
import { WinType } from '@app/types/types.ts'

const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const { openWindow, openedWindows } = useWindows()

// Appearance
const backgroundImage = computed(() => settingsStore.backgroundSrc)
const backgroundColor = computed(() => settingsStore.background.color)

onMounted(() => {
  openWindow(WinType.LOADING)

  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  }

  userAuthStore.loadUser()
})
</script>
