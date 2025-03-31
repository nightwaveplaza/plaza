import { useSocket } from '@app/composables/useSocket.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { watch } from 'vue'
import { useWindows, WinType } from '@app/composables/useWindows.ts'

export function useStatusUpdater () {
  const { onEvent, isConnected, reconnectAttempts } = useSocket()
  const { setStatus, setListeners, setReactions } = useNowPlayingStatus()
  const { openWindow, closeWindow } = useWindows()


  watch(() => reconnectAttempts.value, (attempts) => {
    if (!isConnected.value && attempts >= 3) openWindow(WinType.DISCONNECTED)
  })

  watch(() => isConnected.value, (connected) => {
    if (connected) closeWindow(WinType.DISCONNECTED)
  })

  onEvent('status', (status) => setStatus(status))
  onEvent('listeners', (listeners) => setListeners(listeners))
  onEvent('reactions', (reactions) => setReactions(reactions))
}
