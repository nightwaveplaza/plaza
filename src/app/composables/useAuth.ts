import { computed, ref } from 'vue'
import { useUserApi } from '@app/composables/api'
import type { User } from '@app/types'
import { useReactions } from '@app/composables/useReactions.ts'
import { setApiToken } from '@app/api'

const { getUser } = useUserApi()

const user = ref<User|null>(null)
const resetToken = ref<string|null>(null)

export function useAuth() {
  const { resetReaction } = useReactions()
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
    setApiToken(null)
    user.value = null
  }

  return { fetchUser, unsetUser, user, isSigned, resetToken }
}
