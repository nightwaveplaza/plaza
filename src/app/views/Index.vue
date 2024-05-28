<template>
  <div class="app-desktop" :class="settingsStore.themeName" :style="{backgroundImage, backgroundColor}">
    <component :is="window.form" v-for="window in windowsStore.windows" :key="window.name" />

    <window-song v-for="s in windowsStore.songWindows" :id="s.id" :key="s.id" :name="s.name" />
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type" />

    <win-taskbar />
    <win-status-bar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '@app/stores/settingsStore'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'

const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()

// Appearance
const backgroundImage = computed(() => settingsStore.backgroundSrc)
const backgroundColor = computed(() => settingsStore.background.color)

onMounted(() => {
  windowsStore.open('loading')

  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  }

  userAuthStore.loadUser()
})
</script>
