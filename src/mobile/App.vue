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
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { useBackgrounds } from '@app/composables/useBackgrounds.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'

const i18n = useI18n()
const { openWindow, openedWindows } = useWindows()
const { themeName, language } = useAppSettings()
const { fetch: fetchBackgrounds, backgroundColor, isRandomMode, setRandomBackground } = useBackgrounds()
const { fetchUser } = useAuth()

watch(() => language.value, () => {
  i18n.locale.value = language.value
})

onMounted(() => {
  // todo
  i18n.locale.value = language.value

  openWindow(Win.LOADING)

  if (isRandomMode.value) {
    fetchBackgrounds().then(() => setRandomBackground())
  }

  Native.onReady()

  fetchUser()

  //Native.getUserAgent()!.then(agent => userAuthStore.agent = agent as string)
})
</script>
