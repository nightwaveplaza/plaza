import Vue from 'vue';
import Vuex from 'vuex';
import {playerStore} from '@base/js/stores/player-store';
import {windowStore} from '@base/js/stores/window-store';
import {backgroundStore} from '@base/js/stores/background-store';
import {userStore} from '@base/js/stores/user-store';
import {Native} from '@mobile/js/bridge/native';

Vue.use(Vuex);

export const store = new Vuex.Store({
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
    pushData(state, {name, data}) {
      state.data[name] = data;
    },

    userAgent(state, userAgent) {
      state.userAgent = userAgent;
    },

    isPlaying(state, isPlaying) {
      state.isPlaying = isPlaying;
    },

    sleepTime(state, sleepTime) {
      state.sleepTime = sleepTime;
    },
  },

  actions: {
    async login(context, user) {
      await context.dispatch('setToken', user.token);
      context.commit('user/auth', user);
    },

    async logout(context) {
      await context.dispatch('setToken', '');
      await context.dispatch('user/logout');
    },

    async setToken(context, token) {
      context.commit('user/token', token);
      await Native.setAuthToken(token);
    },

    async setReactionNative(context, score) {
      await Native.setReaction(score);
    },
  },

  getters: {
    isPlaying: state => state.isPlaying,
    sleepTime: state => state.sleepTime,
    viewVersion: () => process.env.version,
  },
});
