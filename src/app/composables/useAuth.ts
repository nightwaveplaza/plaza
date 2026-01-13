import { computed, type ComputedRef, type Ref, ref, type UnwrapRef } from 'vue'
import { useUserApi } from '@app/composables/api'
import type { User } from '@app/types'
import { useReactions } from '@app/composables/useReactions.ts'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'

const { getUser } = useUserApi()

const user = ref<User|null>(null)
const resetToken = ref<string|null>(null)

export function useAuth(): {
  fetchUser: () => void
  setUser: (user: User) => void
  unsetUser: () => void
  user: Ref<UnwrapRef<User | null>>
  isSigned: ComputedRef<boolean>
  resetToken: Ref<UnwrapRef<string | null>>
  setResetToken: (token: string) => void
} {
  const { resetReaction } = useReactions()
  const { setToken } = useAuthToken()

  const fetchUser = (): void => {
    getUser().fetch().then(res => {
      user.value = res.data
    }).catch(() => {
      console.error('Failed to get user.');
    })
  }

  const setUser = (_user: User): void => {
    user.value = _user
  }

  const unsetUser = (): void => {
    resetReaction()
    setToken(null)
    user.value = null
  }

  const setResetToken = (token: string): void => {
    resetToken.value = token
  }

  const isSigned = computed(() => user.value !== null)

  return { fetchUser, setUser, unsetUser, user, isSigned, resetToken, setResetToken }
}
