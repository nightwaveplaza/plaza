<template>
  <div class="app-desktop" :class="settingsStore.themeName" :style="{backgroundImage, backgroundColor}">
    <router-view />

    <win-taskbar />
    <win-status-bar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useSettingsStore } from '@app/stores/settingsStore'
import { useI18n } from 'vue-i18n'

const settingsStore = useSettingsStore()
const i18n = useI18n()

// Appearance
const backgroundImage = computed(() => settingsStore.backgroundSrc)
const backgroundColor = computed(() => settingsStore.background.color)

watch(() => settingsStore.language, () => {
  i18n.locale.value = settingsStore.language
})

onMounted(() => {
  settingsStore.loadSettings()
})
</script>
