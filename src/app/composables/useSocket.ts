import { computed, type ComputedRef, onUnmounted, type Ref, ref } from 'vue'
import io, { Socket } from 'socket.io-client'

/**
 * useSocket composable
 * Manages socket.io connection.
 */

// Max reconnection attempts before socket io gives up.
const MAX_RECONNECT_ATTEMPTS = 24

// Global states
const socket = ref<Socket | null>(null)
const isConnected = ref(false)
const reconnectAttempts = ref(0)

/**
 * Initializes the Socket.io instance if not already created.
 */
function createSocket (): void {
  if (!socket.value) {
    socket.value = io('https://plaza.one', {
      autoConnect: true,
      path: '/ws',
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      timeout: 5000
    })

    // Register global events
    socket.value.on('connect', () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    })
    socket.value.on('disconnect', () => isConnected.value = false)
    socket.value.on('connect_error', () => reconnectAttempts.value += 1)
  }
}

/**
 * Main composable function
 */
export function useSocket (): {
  isConnected: Ref<boolean>
  isDead: ComputedRef<boolean>
  reconnect: () => void
  onEvent: (event: string, callback: (...args: unknown[]) => void) => void
  reconnectAttempts: Ref<number>
} {
  // Local event listeners storage for cleanup
  const localEvents: Array<[string, (...args: unknown[]) => void]> = []

  // Computed flag for dead connection state
  const isDead = computed(() => reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS)

  createSocket()

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
    reconnectAttempts.value = 0
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
    isConnected, isDead, reconnect, onEvent, reconnectAttempts
  }
}
