<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { PlayerState } from '@app/types/types.ts'
import { Native } from '@mobile/bridge/native.ts'
import { eventBus } from '@mobile/events/eventBus.ts'
import { useIosCallbackStore } from '@mobile/stores/iosCallbackStore.ts'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { type Background, useBackgrounds  } from '@app/composables/useBackgrounds.ts'
import { useAuth } from '@app/composables/useAuth.ts'

const i18n = useI18n()

const playerPlayback = usePlayerPlaybackStore()
const iosCallbackStore = useIosCallbackStore()
const { openWindow, closeWindow, WinType } = useWindows()
const { lowQuality, language } = useAppSettings()
const { background, isColorMode } = useBackgrounds()
const { isSigned } = useAuth()

function updateBackgroundNative (bg: Background): void {
  if (typeof AndroidInterface !== 'undefined') {
    Native.setBackground(isColorMode.value ? 'solid' : bg.image!.src)
  } else {
    Native.setBackground(isColorMode.value ? 'solid' : bg.image!.video_src)
  }
}

function registerEmitterEvents (): void {
  eventBus.on('resume', () => updateBackgroundNative(background))

  eventBus.on('closeWindow', (name: string) => {
    closeWindow(name)
  })

  eventBus.on('openWindow', (name: string) => {
    if ((name === 'user-favorites' || name === 'user') && !isSigned.value) {
      openWindow(WinType.USER_LOGIN)
      return
    }

    openWindow(name)
  })

  // ios callbacks
  eventBus.on('iosCallback', (data: string) => {
    iosCallbackStore.execute(data)
  })

  eventBus.on('isPlaying', (playing: boolean) => {
    playerPlayback.state = playing ? PlayerState.PLAYING : PlayerState.IDLE
  })

  eventBus.on('isBuffering', () => {
    playerPlayback.state = PlayerState.LOADING
  })

  // Event from onResume if sleep timer is still alive
  eventBus.on('sleepTime', (time: number) => {
    if (time > Date.now()) {
      playerPlayback.sleepTime = time
    }
  })
}

// Watch background for changes
watch(() => background, (b) => {
      if (b.image) {
        updateBackgroundNative(b as Background)
      }
    }, { deep: true },
)

// Watch user token for changes
// TODO
//watch(() => userAuthStore.token, (t) => Native.setAuthToken(t as string))

// Watch audio quality
watch(() => lowQuality.value, () => {
  Native.setAudioQuality(lowQuality.value)
})

// Watch timer changes
watch(() => playerPlayback.sleepTime, (time) => {
  Native.setSleepTimer(time)
})

// Watch language change
watch(() => language.value, () => {
  i18n.locale.value = language.value
  Native.setLanguage(language.value)
})

onMounted(() => {
  registerEmitterEvents()
})
</script>
