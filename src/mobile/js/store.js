import { Native } from '@mobile/js/bridge/native'
import { playerStore } from '@common/js/store/player'
import { windowStore } from '@common/js/store/window'
import { backgroundStore } from '@common/js/store/background'
import { userStore } from '@common/js/store/user'
import { createStore } from 'vuex'

export default createStore({
  modules: {
    windows: windowStore,
    player: playerStore,
    background: backgroundStore,
    user: userStore,
  },

  state: {
    data: {},
    userAgent: 'Android Axios',

    isPlaying: false,
    sleepTime: 0,
  },

  mutations: {
    pushData (state, { name, data }) {
      state.data[name] = data
    },

    userAgent (state, userAgent) {
      state.userAgent = userAgent
    },

    isPlaying (state, isPlaying) {
      state.isPlaying = isPlaying
    },

    sleepTime (state, sleepTime) {
      state.sleepTime = sleepTime
    },
  },

  actions: {
    async login (context, user) {
      await context.dispatch('setToken', user.token)
      context.commit('user/auth', user)
    },

    async logout (context) {
      await context.dispatch('setToken', '')
      await context.dispatch('user/logout')
    },

    async setToken (context, token) {
      context.commit('user/token', token)
      await Native.setAuthToken(token)
    },

    async setReactionNative (context, score) {
      await Native.setReaction(score)
    },
  },

  getters: {
    isPlaying: state => state.isPlaying,
    sleepTime: state => state.sleepTime,
  },
})
