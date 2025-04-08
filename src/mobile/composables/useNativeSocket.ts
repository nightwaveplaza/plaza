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
  const onReconnectFailed = () => {
    isDead.value = true
  }

  const onConnect = () => {
    isConnected.value = true
  }

  const onDisconnect = () => {
    isConnected.value = false
  }

  const reconnect = () => {
    isDead.value = false
    Native.socketReconnect()
  }

  return { isDead, isConnected, onReconnectFailed, onConnect, onDisconnect, reconnect }
}
