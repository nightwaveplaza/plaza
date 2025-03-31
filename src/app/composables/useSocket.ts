import { computed, onUnmounted, ref } from 'vue'
import io, { Socket } from 'socket.io-client'

const maxReconnectAttempts = 12

const socket = ref<Socket | null>(null)
const isConnected = ref(false)
const reconnectAttempts = ref(0)

function createSocket () {
  if (!socket.value) {
    socket.value = io('https://plaza.one', {
      autoConnect: true,
      path: '/ws',
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 5000
    })

    // Global events
    socket.value.on('connect', () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    })
    socket.value.on('disconnect', () => isConnected.value = false)
    socket.value.on('connect_error', () => reconnectAttempts.value += 1)
  }
}

export function useSocket () {
  const localEvents: Array<[string, (...args: any[]) => void]> = []
  const isDead = computed(() => reconnectAttempts.value >= maxReconnectAttempts)

  createSocket()

  const onEvent = (event: string, callback: (...args: any[]) => void) => {
    socket.value?.on(event, callback)
    localEvents.push([event, callback])
  }

  const reconnect = () => {
    reconnectAttempts.value = 0
    socket.value?.connect()
  }

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
