import { defineStore } from 'pinia'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'
import { user } from '@common/js/api/api'
import Cookies from 'js-cookie'
import type { ifcUserProfile } from '@common/js/types'
import helperComposable from '@common/js/composables/helperComposable'
import { Native } from '@mobile/js/bridge/native'

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
        user.get().then(result => {
          console.log(this.token)
          this.signed = true
          this.username = result.data.username
        }).catch(() => {})
      }
    },

    login(userProfile: ifcUserProfile, remember: boolean = false) {
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
