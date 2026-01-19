<template>
  <div :class="themeName" :style="{backgroundColor}" class="app-desktop">
    <win-window
      v-for="window in openedWindows"
      :id="window.id"
      :key="window.id"
      :component="window.component"
    />
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
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { useNewsPopup } from '@app/composables/useNewsPopup.ts'

const i18n = useI18n()
const { openWindow, openedWindows, closeWindow } = useWindows()
const { themeName, language } = useAppSettings()
const { fetch: fetchBackgrounds, backgroundColor, isRandomMode, setRandomBackground } = useBackgrounds()
const { openNewsIfUpdated } = useNewsPopup()

const { updateBackgroundNative } = useNativeEvents()
const { song } = useNowPlayingStatus()

watch(() => language.value, () => {
  i18n.locale.value = language.value
})

onMounted(() => {
  // todo
  i18n.locale.value = language.value

  // Automatically apply theme color to browser
  useThemeColor()

  openWindow(Win.LOADING)
  setTimeout(() => Native.onReady(), 1000) // let loading animation play a bit

  if (isRandomMode.value) {
    fetchBackgrounds().then(() => setRandomBackground())
  } else {
    updateBackgroundNative()
  }

  Native.getAuthToken()!.then((t) => {
    const token = t as string
    useAuthToken().setToken(token)
    useAuth().fetchUser()
  })
})

// waiting for the first status response then check news and open up player
watch(() => song.id, () => {
  openWindow(Win.PLAYER)
  closeWindow(Win.LOADING)
  openNewsIfUpdated()
}, {
  once: true
})
</script>
