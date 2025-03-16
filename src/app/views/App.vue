<template>
  <div class="app-desktop" :class="settingsStore.themeName" :style="{backgroundImage, backgroundColor}">
    <router-view />

    <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />
    <win-taskbar />
    <win-status-bar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useSettingsStore } from '@app/stores/settingsStore'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useRouter } from 'vue-router'

const settingsStore = useSettingsStore()
const i18n = useI18n()
const router = useRouter()
const { openedWindows } = useWindows()

// Appearance
const backgroundImage = computed(() => settingsStore.backgroundSrc)
const backgroundColor = computed(() => settingsStore.background.color)

watch(() => settingsStore.language, () => {
  i18n.locale.value = settingsStore.language
})

// Redirect to index if all windows are closed
watch(() => openedWindows.value, (n) => {
  if (Object.keys(n).length === 0) {
    router.push({ name: 'index' })
  }
}, {deep: true})

onMounted(() => {
  settingsStore.loadSettings()

  if (settingsStore.isBackgroundRandomMode) {
    settingsStore.loadRandomBackground()
  }
})
</script>
