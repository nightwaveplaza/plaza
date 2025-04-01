import { computed, ref } from 'vue'
import { useUserApi } from '@app/composables/api/useUserApi.ts'
import type { User } from '@app/types'
import { useReactions } from '@app/composables/useReactions.ts'
const { getUser } = useUserApi()

const username = ref<string|null>(null)
const resetToken = ref<string|null>(null)

export function useAuth() {
  const { resetReaction } = useReactions()

  const fetchUser = () => {
    getUser().fetch().then(res => {
      username.value = res.data.username
    }).catch(() => {
      console.error('Failed to get user.');
    })
  }

  const setUser = (user: User) => {
    username.value = user.username
  }

  const unsetUser = () => {
    resetReaction()
    username.value = null
  }

  const setResetToken = (token: string) => {
    resetToken.value = token
  }

  const isSigned = computed(() => username.value !== null)

  return { fetchUser, setUser, unsetUser, username, isSigned, resetToken, setResetToken }
}
