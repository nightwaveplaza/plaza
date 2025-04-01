import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { isMobile } from '@app/utils/helpers.ts'
import type { UserLoginResponse } from '@app/types'
import { useUserApi } from '@app/composables/api/useUserApi.ts'
import { useReactions } from '@app/composables/useReactions.ts'

const { getUser } = useUserApi()

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
        getUser().fetch().then(res => {
          this.signed = true
          this.username = res.data.username
        }).catch(() => {
          console.error('Failed to get user.');
        })
      }
    },

    login (userProfile: UserLoginResponse, remember = false) {
      if (remember && navigator.cookieEnabled) {
        cookieApi.set('token', userProfile.token, { expires: 180 })
      } else {
        cookieApi.set('token', userProfile.token)
      }

      this.token = userProfile.token
      this.username = userProfile.data.username
      this.signed = true
    },

    logout () {
      const userReaction = useReactions()
      userReaction.resetReaction()

      this.signed = false
      this.username = 'Guest'
      this.token = null
      cookieApi.remove('token')
    }
  }
})
