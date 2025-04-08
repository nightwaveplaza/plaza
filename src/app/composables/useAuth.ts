import { computed, type ComputedRef, type Ref, ref, type UnwrapRef } from 'vue'
import { useUserApi } from '@app/composables/api'
import type { User } from '@app/types'
import { useReactions } from '@app/composables/useReactions.ts'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'

const { getUser } = useUserApi()

const username = ref<string|null>(null)
const resetToken = ref<string|null>(null)

export function useAuth(): {
  fetchUser: () => void
  setUser: (user: User) => void
  unsetUser: () => void
  username: Ref<UnwrapRef<string | null>>
  isSigned: ComputedRef<boolean>
  resetToken: Ref<UnwrapRef<string | null>>
  setResetToken: (token: string) => void
} {
  const { resetReaction } = useReactions()
  const { setToken } = useAuthToken()

  const fetchUser = (): void => {
    getUser().fetch().then(res => {
      username.value = res.data.username
    }).catch(() => {
      console.error('Failed to get user.');
    })
  }

  const setUser = (user: User): void => {
    username.value = user.username
  }

  const unsetUser = (): void => {
    resetReaction()
    setToken(null)
    username.value = null
  }

  const setResetToken = (token: string): void => {
    resetToken.value = token
  }

  const isSigned = computed(() => username.value !== null)

  return { fetchUser, setUser, unsetUser, username, isSigned, resetToken, setResetToken }
}
