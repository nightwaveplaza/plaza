import { defineStore } from 'pinia'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'
import { user } from '@common/js/api/api'
import Cookies from 'js-cookie'
import type { ifcUserProfile } from '@common/js/types'

interface State {
  username: string,
  signed: boolean,
  agent: string
}

const cookieApi = Cookies.withAttributes({
  path: '/',
  secure: true,
})

export const useUserAuthStore = defineStore('userAuthStore', {
  state: (): State => ({
    username: 'Guest',
    signed: false,
    agent: 'Nightwave Plaza Axios'
  }),

  getters: {
    savedToken: () => cookieApi.get('token')
  },

  actions: {
    loadUser() {
      if (this.savedToken) {
        user.get().then(result => {
          this.signed = true
          this.username = result.data.username
        }).catch(() => {})
      }
    },

    login(userProfile: ifcUserProfile, remember: boolean = false) {
      if (remember) {
        cookieApi.set('token', userProfile.token, { expires: 180 })
      } else {
        cookieApi.set('token', userProfile.token)
      }

      this.username = userProfile.username
      this.signed = true
    },

    logout() {
      const userReactionStore = useUserReactionStore()
      this.signed = false
      this.username = 'Guest'
      cookieApi.remove('token')
      userReactionStore.$reset()
      userReactionStore.save()
    }
  }
})
