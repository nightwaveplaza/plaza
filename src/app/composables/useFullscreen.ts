import { isMobile } from '@app/utils/helpers.ts'
import { Native } from '@mobile/bridge/native.ts'

export function useFullscreen (): { isFullscreenEnabled: boolean; requestFullscreen: () => void } {
  const isFullscreenEnabled = isMobile() || document.fullscreenEnabled

  const requestFullscreen = (): void => {
    if (isMobile()) {
      Native.toggleFullscreen()
    } else {
      document.getElementById('app')?.requestFullscreen()
    }
  }

  return { isFullscreenEnabled, requestFullscreen }
}
