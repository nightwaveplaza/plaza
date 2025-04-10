import { onUnmounted, type Ref, ref, type UnwrapRef } from 'vue'
import io, { Socket } from 'socket.io-client'

/**
 * useSocket composable
 * Manages socket.io connection.
 */

// Global states
const socket = ref<Socket | null>(null)
const isConnected = ref(false)
const isDead = ref(false)
const reconnectAttempts = ref(0)

/**
 * Main composable function
 */
export function useSocket (): {
  isConnected: Ref<UnwrapRef<boolean>>
  isDead: Ref<UnwrapRef<boolean>>
  reconnectAttempts: Ref<UnwrapRef<number>>
  reconnect: () => void
  onEvent: (event: string, callback: (...args: unknown[]) => void) => void
  createSocket: () => void
} {
  // Local event listeners storage for cleanup
  const localEvents: Array<[string, (...args: unknown[]) => void]> = []

  /**
   * Initializes the Socket.io instance if not already created.
   */
  function createSocket (): void {
    if (!socket.value) {
      socket.value = io('https://plaza.one', {
        autoConnect: true,
        path: '/ws',
        reconnectionAttempts: 5,
        timeout: 5000
      })

      // Register global events
      socket.value.on('connect', () => {
        isConnected.value = true
        isDead.value = false
      })
      socket.value.on('disconnect', () => isConnected.value = false)
      socket.value.io.on('reconnect_failed', () => isDead.value = true)
      socket.value.io.on('reconnect_attempt', (n) => reconnectAttempts.value = n)
    }
  }

  /**
   * Registers event listener and stores it for later cleanup
   * @param event - Socket.io event name
   * @param callback - Event handler function
   */
  const onEvent = (event: string, callback: (...args: unknown[]) => void): void => {
    socket.value?.on(event, callback)
    localEvents.push([event, callback])
  }

  /**
   * Forces reconnection attempt and resets reconnect counter
   */
  const reconnect = (): void => {
    socket.value?.connect()
  }

  // Cleanup: Remove all registered event listeners when component unmounts
  onUnmounted(() => {
    localEvents.forEach(([event, callback]) => {
      socket.value?.off(event, callback)
    })
    localEvents.length = 0
  })

  return {
    isConnected, isDead, reconnect, onEvent, createSocket, reconnectAttempts
  }
}
