import { defineStore } from 'pinia'
import { useUserReactionStore } from '@app/stores/userReactionStore'
import { api } from '@app/api/api'
import Cookies from 'js-cookie'
import type { UserProfile } from '@app/types/types'
import { isMobile } from '@app/utils/helpers.ts'

interface State {
  username: string,
  signed: boolean,
  agent: string,
  token: string | null,
  resetToken: string | null
}

const cookieApi = Cookies.withAttributes({
  path: '/',
  secure: false,
})

export const useUserAuthStore = defineStore('userAuthStore', {
  state: (): State => ({
    username: 'Guest',
    signed: false,
    agent: 'Nightwave Plaza Axios',
    token: null,
    resetToken: null
  }),

  actions: {
    loadUser () {
      if (!isMobile()) {
        this.token = cookieApi.get('token') ?? null
      }

      if (this.token !== null) {
        api.user.get().then(res => {
          this.signed = true
          this.username = res.data.username
        }).catch(() => {
          console.error('Failed to get user.');
        })
      }
    },

    login (userProfile: UserProfile, remember = false) {
      if (remember && navigator.cookieEnabled) {
        cookieApi.set('token', userProfile.token, { expires: 180 })
      } else {
        cookieApi.set('token', userProfile.token)
      }

      this.token = userProfile.token
      this.username = userProfile.username
      this.signed = true
    },

    logout () {
      const userReactionStore = useUserReactionStore()
      userReactionStore.reset()

      this.signed = false
      this.username = 'Guest'
      this.token = null
      cookieApi.remove('token')
    }
  }
})
