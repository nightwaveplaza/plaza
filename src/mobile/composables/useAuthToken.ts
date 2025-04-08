import { ref } from 'vue'
import { Native } from '@mobile/bridge/native.ts'

const token = ref<string | null>(null)

export function useAuthToken() {
  const setToken = (t: string) => {
    token.value = t
  }

  const updateToken = (t: string) => {
    token.value = t
    Native.setAuthToken(t)
  }

  return { token, setToken, updateToken }
}
