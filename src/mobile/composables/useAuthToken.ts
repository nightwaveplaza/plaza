import { type Ref, ref, type UnwrapRef } from 'vue'

const token = ref<string | null>(null)

export function useAuthToken (): {
  token: Ref<UnwrapRef<string | null>>;
  setToken: (t: (string | null)) => void
} {
  const setToken = (t: string | null): void=> {
    token.value = t
  }

  return { token, setToken }
}
