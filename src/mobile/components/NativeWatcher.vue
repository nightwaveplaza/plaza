<script setup lang="ts">
import { useSettingsStore } from '@app/stores/settingsStore.ts'
import { useUserAuthStore } from '@app/stores/userAuthStore.ts'
import { onMounted, watch } from 'vue'
import { type Background, enBackgroundMode, PlayerState } from '@app/types/types.ts'
import { Native } from '@mobile/bridge/native.ts'
import { eventBus } from '@mobile/events/eventBus.ts'
import { useWindowsStore } from '@app/stores/windowsStore.ts'
import { useIosCallbackStore } from '@mobile/stores/iosCallbackStore.ts'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()
const iosCallbackStore = useIosCallbackStore()

function updateBackgroundNative (bg: Background): void {
  if (typeof AndroidInterface !== 'undefined') {
    Native.setBackground(bg.mode === enBackgroundMode.SOLID ? 'solid' : bg.image!.src)
  } else {
    Native.setBackground(bg.mode === enBackgroundMode.SOLID ? 'solid' : bg.image!.video_src)
  }
}

function registerEmitterEvents (): void {
  eventBus.on('resume', () => updateBackgroundNative(settingsStore.background))

  eventBus.on('closeWindow', (name: string) => {
    windowsStore.close(name)
  })

  eventBus.on('openWindow', (name: string) => {
    if ((name === 'user-favorites' || name === 'user') && !userAuthStore.signed) {
      windowsStore.open('user-login')
      return
    }

    windowsStore.open(name)
  })

  // ios callbacks
  eventBus.on('iosCallback', (data: string) => {
    iosCallbackStore.execute(data)
  })

  eventBus.on('isPlaying', (playing: boolean) => {
    playerPlaybackStore.state = playing ? PlayerState.PLAYING : PlayerState.IDLE
  })

  eventBus.on('isBuffering', () => {
    playerPlaybackStore.state = PlayerState.LOADING
  })

  // Event from onResume if sleep timer is still alive
  eventBus.on('sleepTime', (time: number) => {
    if (time > Date.now()) {
      playerPlaybackStore.sleepTime = time
    }
  })
}

// Watch background for changes
watch(() => settingsStore.background, (b) => {
      if (b.image) {
        updateBackgroundNative(b as Background)
      }
    }, { deep: true },
)

// Watch user token for changes
watch(() => userAuthStore.token, (t) => Native.setAuthToken(t as string))

// Watch audio quality
watch(() => settingsStore.lowQuality, (lowQuality) => {
  Native.setAudioQuality(lowQuality)
})

// Watch timer changes
watch(() => playerPlaybackStore.sleepTime, (time) => {
  Native.setSleepTimer(time)
})

// Watch language change
watch(() => settingsStore.language, () => {
  i18n.locale.value = settingsStore.language
  Native.setLanguage(settingsStore.language)
})

onMounted(() => {
  registerEmitterEvents()
})
</script>
