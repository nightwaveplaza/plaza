import { ref } from 'vue'

const isConnected = ref(false)
const isDead = ref(false)

export function useSocketStore() {
  return { isConnected, isDead }
}