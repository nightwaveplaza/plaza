import { io } from 'socket.io-client'
import {
  useNowPlayingStatus,
} from '@app/composables/player/useNowPlayingStatus'
import { useSocketStore } from '@app/composables/useSocketStore.ts'
import type { StatusResource } from '@app/types'
import { isMobile } from '@app/utils/helpers.ts'

let isInitialized = false

export function initAppSocket (): void {
  if (isInitialized) return
  isInitialized = true

  const { setStatus, listeners, reactions } = useNowPlayingStatus()
  const { isConnected, isDead } = useSocketStore()

  const socket = io('https://plaza.one', {
    path: '/ws',
    autoConnect: true,
    timeout: 5000,
  })

  socket.on('connect', () => isConnected.value = true)
  socket.on('disconnect', () => isConnected.value = false)
  socket.on('status', (data: StatusResource) => setStatus(data))
  socket.on('listeners', (data: number) => listeners.value = data)
  socket.on('reactions', (data: number) => reactions.value = data)
  socket.on('reconnect_failed', () => isDead.value = true)

  if (isMobile()) {
    window.addEventListener('app:stop', () => {
      if (socket.connected) {
        socket.disconnect()
      }
    })

    window.addEventListener('app:start', () => {
      if (socket.disconnected) {
        socket.connect()
      }
    })
  }

}