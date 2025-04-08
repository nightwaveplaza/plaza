import { ref } from 'vue'

const token = ref<string | null>(null)

export function useAuthToken() {
  const setToken = (t: string | null) => {
    token.value = t
  }

  return { token, setToken }
}
