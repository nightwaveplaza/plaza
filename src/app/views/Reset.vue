<template>
  <div class="app-desktop" :class="settingsStore.themeName" :style="{backgroundImage, backgroundColor}">
    <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />

    <win-taskbar />
    <win-status-bar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWindows } from '@app/composables/useWindows.ts'
import { useUserAuthStore } from '@app/stores/userAuthStore.ts'
import { useSettingsStore } from '@app/stores/settingsStore.ts'

const router = useRouter()
const route = useRoute()
const userAuthStore = useUserAuthStore()
const { openedWindows, openWindow, WinType } = useWindows()
const settingsStore = useSettingsStore()

const backgroundImage = computed(() => settingsStore.backgroundSrc)
const backgroundColor = computed(() => settingsStore.background.color)

// Redirect to index if all windows are closed
watch(() => openedWindows.value, (n) => {
  if (Object.keys(n).length === 0) {
     router.push({ name: 'index' })
  }
}, {deep: true})

onMounted(() => {
  if (route.params.token) {
    userAuthStore.resetToken = route.params.token as string
    openWindow(WinType.USER_RESET_PASSWORD)
  } else {
    openWindow(WinType.USER_RESET)
  }
})
</script>
