import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { useBackgrounds } from '@app/composables/useBackgrounds.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { usePlayerPlayback } from '@app/composables/player/usePlayerPlayback.ts'
import { useIosCallbacks } from '@mobile/composables/useIosCallbacks.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { useNativeSocket } from '@mobile/composables/useNativeSocket.ts'
import { PlayerState, Win } from '@app/types'
import { Native } from '@mobile/bridge/native.ts'
import { watch } from 'vue'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'
import { eventBus } from '@mobile/emitter.ts'

export function useNativeEvents (): {
  updateBackgroundNative: () => void
} {
  const i18n = useI18n()

  const { openWindow, closeWindow } = useWindows()
  const { lowQuality, language } = useAppSettings()
  const { background, isColorMode } = useBackgrounds()
  const { isSigned } = useAuth()
  const { setState, updateSleepTime } = usePlayerPlayback()
  const { execute } = useIosCallbacks()
  const { setStatus, setListeners, setReactions } = useNowPlayingStatus()
  const { onConnect, onDisconnect, onReconnectFailed } = useNativeSocket()
  const { token } = useAuthToken()

  /**
   * Socket events
   */
  eventBus.on('socketConnect', () => {
    onConnect()
    //closeWindow(Win.DISCONNECTED)
  })
  eventBus.on('socketDisconnect', () => onDisconnect())
  eventBus.on('socketReconnectFailed', () => {
    onReconnectFailed()
    //openWindow(Win.DISCONNECTED)
  })
  eventBus.on('onStatusUpdate', (s: string) => {
    console.log(s)
    setStatus(JSON.parse(s))
  })
  eventBus.on('onListenersUpdate', (l: number) => setListeners(l))
  eventBus.on('onReactionsUpdate', (r: number) => setReactions(r))

  /**
   * Android events
   */
  eventBus.on('onResume', () => updateBackgroundNative)

  /**
   * Player events
   */
  eventBus.on('isPlaying', (playing: boolean) => {
    setState(playing ? PlayerState.PLAYING : PlayerState.IDLE)
  })
  eventBus.on('isBuffering', () => {
    setState(PlayerState.LOADING)
  })

  /**
   * Actions
   */
  eventBus.on('closeWindow', (name: string) => {
    closeWindow(name)
  })

  eventBus.on('openWindow', (name: Win) => {
    if ((name === 'user-favorites' || name === 'user') && !isSigned.value) {
      openWindow(Win.USER_LOGIN)
      return
    }

    openWindow(name)
  })

  // Event from onResume if sleep timer is still alive
  eventBus.on('sleepTime', (time: number) => {
    updateSleepTime(time)
  })

  // ios callbacks
  eventBus.on('iosCallback', (data: string) => {
    execute(data)
  })

  // Watch background for changes
  watch(() => background.color, updateBackgroundNative)
  watch(() => background.image, updateBackgroundNative)

  // Watch user token for changes
  watch(() => token.value, t => {
    Native.setAuthToken(t as string)
  })

  // Watch audio quality
  watch(() => lowQuality.value, () => {
    Native.setAudioQuality(lowQuality.value)
  })

  // Watch language change
  watch(() => language.value, () => {
    i18n.locale.value = language.value
    Native.setLanguage(language.value)
  })

  function updateBackgroundNative (): void {
    if (typeof AndroidInterface !== 'undefined') {
      Native.setBackground(isColorMode.value ? 'solid' : background.image!.src)
    } else {
      Native.setBackground(isColorMode.value ? 'solid' : background.image!.video_src)
    }
  }

  return { updateBackgroundNative }
}
