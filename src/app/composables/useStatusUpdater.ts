import { useSocket } from '@app/composables/useSocket.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { type StatusResource } from '@app/types'

/**
 * useStatusUpdater composable
 * Uses useSocket and useNowPlayingStatus composable to update current now playing status
 */
export function useStatusUpdater (): void {
  const { onEvent, createSocket } = useSocket()
  const { setStatus, setListeners, setReactions } = useNowPlayingStatus()

  createSocket()

  onEvent('status', (status) => setStatus(status as StatusResource))
  onEvent('listeners', (listeners) => setListeners(listeners as number))
  onEvent('reactions', (reactions) => setReactions(reactions as number))
}
