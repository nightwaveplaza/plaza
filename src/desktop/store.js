import { createStore } from 'vuex'
import Cookies from 'js-cookie'
import { playerStore } from '@common/store/player'
import { windowStore } from '@common/store/window'
import { backgroundStore } from '@common/store/background'
import { userStore } from '@common/store/user'

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
        Cookies.set('token', user.token, { expires: 180 })
      } else {
        Cookies.set('token', user.token)
      }

      context.commit('user/auth', user)
      context.commit('user/token', user.token)
    },

    async logout (context) {
      await context.dispatch('user/logout')
      Cookies.remove('token')
    },
  },

  getters: {
    token: () => Cookies.get('token'),
    viewVersion: () => process.env.version,
  },
})
