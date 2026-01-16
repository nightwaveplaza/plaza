<template>
  <div :class="themeName" :style="{backgroundColor}" class="app-desktop">
    <component :is="window.component" v-for="window in openedWindows" :key="window.name" :name="window.name" />

    <win-taskbar />
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
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'
import { useNativeEvents } from '@mobile/composables/useNativeEvents.ts'
import { useThemeColor } from '@app/composables/useThemeColor.ts'

const i18n = useI18n()
const { openWindow, openedWindows } = useWindows()
const { themeName, language } = useAppSettings()
const { fetch: fetchBackgrounds, backgroundColor, isRandomMode, setRandomBackground } = useBackgrounds()

const { updateBackgroundNative } = useNativeEvents()

// Automatically apply theme color to browser
useThemeColor()

watch(() => language.value, () => {
  i18n.locale.value = language.value
})

onMounted(() => {
  // todo
  i18n.locale.value = language.value

  openWindow(Win.LOADING)

  if (isRandomMode.value) {
    fetchBackgrounds().then(() => setRandomBackground())
  } else {
    updateBackgroundNative()
  }

  Native.onReady()

  Native.getAuthToken()!.then((t) => {
    const token = t as string
    useAuthToken().setToken(token)
    useAuth().fetchUser()
  })
})
</script>
