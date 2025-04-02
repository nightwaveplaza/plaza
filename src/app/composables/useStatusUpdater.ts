import { useSocket } from '@app/composables/useSocket.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { watch } from 'vue'
import { useWindows, WinType } from '@app/composables/useWindows.ts'

/**
 * useStatusUpdater composable
 * Uses useSocket and useNowPlayingStatus composable to update current now playing status
 */
export function useStatusUpdater (): void {
  const { onEvent, isConnected, reconnectAttempts } = useSocket()
  const { setStatus, setListeners, setReactions } = useNowPlayingStatus()
  const { openWindow } = useWindows()

  // Open WinDisconnected when reconnect attempts > 3
  watch(() => reconnectAttempts.value, (attempts) => {
    if (!isConnected.value && attempts >= 3) {
      openWindow(WinType.DISCONNECTED)
    }
  })

  onEvent('status', (status) => setStatus(status))
  onEvent('listeners', (listeners) => setListeners(listeners))
  onEvent('reactions', (reactions) => setReactions(reactions))
}
