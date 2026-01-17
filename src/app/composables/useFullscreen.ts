import { isMobile } from '@app/utils/helpers.ts'
import { Native } from '@mobile/bridge/native.ts'

export function useFullscreen() {

  const isFullscreenEnabled = isMobile() || document.fullscreenEnabled

  const requestFullscreen = () => {
    if (isMobile()) {
      Native.toggleFullscreen()
    } else {
      document.getElementById('app')?.requestFullscreen()
    }
  }

  return { isFullscreenEnabled, requestFullscreen }
}
