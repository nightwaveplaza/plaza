import { useI18n } from 'vue-i18n'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { useBackgrounds } from '@app/composables/useBackgrounds.ts'
import { Native } from '@mobile/bridge/native.ts'
import { watch } from 'vue'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'

export function useNativeEvents (): {
  updateBackgroundNative: () => void
} {
  const i18n = useI18n()

  const { lowQuality, language } = useAppSettings()
  const { background, isColorMode } = useBackgrounds()
  const { token } = useAuthToken()

  /**
   * Android events
   */
  window.addEventListener('app:resume', () => updateBackgroundNative)

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
