import { defineStore } from 'pinia'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'
import { api } from '@common/js/api/api'
import Cookies from 'js-cookie'
import type { UserProfile } from '@common/js/types'
import helperComposable from '@common/js/composables/helperComposable'

const { isMobile } = helperComposable()

interface State {
  username: string,
  signed: boolean,
  agent: string,
  token: string | null
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
    token: null
  }),

  actions: {
    loadUser() {
      if (!isMobile.value) {
        this.token = cookieApi.get('token') ?? null
      }

      if (this.token !== null) {
        api.user.get().then(res => {
          this.signed = true
          this.username = res.data.username
        }).catch(() => {})
      }
    },

    login(userProfile: UserProfile, remember: boolean = false) {
      if (remember && navigator.cookieEnabled) {
        cookieApi.set('token', userProfile.token, { expires: 180 })
      } else {
        cookieApi.set('token', userProfile.token)
      }

      this.token = userProfile.token
      this.username = userProfile.username
      this.signed = true
    },

    logout() {
      const userReactionStore = useUserReactionStore()
      userReactionStore.$reset()

      this.signed = false
      this.username = 'Guest'
      this.token = null
      cookieApi.remove('token')
    }
  }
})
