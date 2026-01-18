import { type Ref, ref, type UnwrapRef } from 'vue'
import { Native } from '@mobile/bridge/native.ts'

const isDead = ref(false)
const isConnected = ref(false)

export function useNativeSocket(): {
  isDead: Ref<UnwrapRef<boolean>>;
  isConnected: Ref<UnwrapRef<boolean>>;
  onReconnectFailed: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  reconnect: () => void
} {
  const onReconnectFailed = (): void => {
    isDead.value = true
  }

  const onConnect = (): void => {
    isConnected.value = true
  }

  const onDisconnect = (): void => {
    isConnected.value = false
  }

  const reconnect = (): void => {
    isDead.value = false
    Native.socketReconnect()
  }

  return { isDead, isConnected, onReconnectFailed, onConnect, onDisconnect, reconnect }
}
