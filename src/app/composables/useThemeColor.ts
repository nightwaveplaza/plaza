import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { onMounted, watch } from 'vue'
import { isMobile } from '@app/utils/helpers.ts'
import { Native } from '@mobile/bridge/native.ts'

const themeColors = {
  'win98': '#c0c0c0',
  'contrast': '#000000',
  'rainy': '#8098b0',
  'rose': '#cfafb7',
  'desert': '#d5ccbb'
}

export function useThemeColor(): void {
  const { theme } = useAppSettings()

  // Set theme color to browser or Native app
  const setThemeColor = (): void => {
    const color = themeColors[theme.value as keyof typeof themeColors]
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)

    if (isMobile()) {
      Native.setThemeColor(color)
    }
  }

  watch(() => theme.value, () => setThemeColor())
  onMounted(() => {
    if (isMobile()) {
      setTimeout(() => setThemeColor(), 1000)
    } else {
      setThemeColor()
    }
  })
}
