import { createStore } from 'vuex'
import Cookies from 'js-cookie'
import { playerStore } from '@common/store/player'
import { windowStore } from '@common/store/window'
import { backgroundStore } from '@common/store/background'
import { userStore } from '@common/store/user'

const cookieApi = Cookies.withAttributes({
  path: '/',
  secure: true
})

export const store = createStore({
  modules: {
    windows: windowStore,
    player: playerStore,
    background: backgroundStore,
    user: userStore,
  },

  actions: {
    login (context, { user, remember }) {
      if (remember) {
        cookieApi.set('token', user.token, { expires: 180 })
      } else {
        cookieApi.set('token', user.token)
      }

      context.commit('user/auth', user)
      context.commit('user/token', user.token)
    },

    async logout (context) {
      await context.dispatch('user/logout')
      cookieApi.remove('token')
    },
  },

  getters: {
    token: () => cookieApi.get('token'),
    viewVersion: () => process.env.version,
  },
})
