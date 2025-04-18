import { useSocket } from '@app/composables/useSocket.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { watch } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { type StatusResource, Win } from '@app/types'

/**
 * useStatusUpdater composable
 * Uses useSocket and useNowPlayingStatus composable to update current now playing status
 */
export function useStatusUpdater (): void {
  const { onEvent, isConnected, reconnectAttempts, createSocket } = useSocket()
  const { setStatus, setListeners, setReactions } = useNowPlayingStatus()
  const { openWindow } = useWindows()

  // Open WinDisconnected when reconnect attempts > 3
  watch(() => reconnectAttempts.value, (attempts) => {
    if (!isConnected.value && attempts >= 3) {
      openWindow(Win.DISCONNECTED)
    }
  })

  createSocket()
  onEvent('status', (status) => setStatus(status as StatusResource))
  onEvent('listeners', (listeners) => setListeners(listeners as number))
  onEvent('reactions', (reactions) => setReactions(reactions as number))
}
