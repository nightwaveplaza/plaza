import { computed, ref } from 'vue'
import { useUserApi } from '@app/composables/api'
import type { User } from '@app/types'
import { useReactions } from '@app/composables/useReactions.ts'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'

const { getUser } = useUserApi()

const user = ref<User|null>(null)
const resetToken = ref<string|null>(null)

export function useAuth() {
  const { resetReaction } = useReactions()
  const { setToken } = useAuthToken()
  const isSigned = computed(() => user.value !== null)

  const fetchUser = async () => {
    try {
      const res = await getUser().fetch()
      user.value = res.data
    } catch (error) {
      console.error('Failed to get user:', error)
    }
  }

  const unsetUser = () => {
    resetReaction()
    setToken(null)
    user.value = null
  }

  return { fetchUser, unsetUser, user, isSigned, resetToken }
}
