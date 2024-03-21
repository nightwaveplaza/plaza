import { defineStore, type StoreDefinition } from 'pinia'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'
import { user } from '@common/js/api/api'
import Cookies from 'js-cookie'

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

    login(user, remember: boolean) {
      if (remember) {
        cookieApi.set('token', user.token, { expires: 180 })
      } else {
        cookieApi.set('token', user.token)
      }

      this.username = user.username
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
