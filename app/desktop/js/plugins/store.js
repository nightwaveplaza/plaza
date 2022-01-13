import Vuex from 'vuex';
import Vue from 'vue';
import Cookies from 'js-cookie';
import {playerStore} from '@common/js/stores/player-store';
import {windowStore} from '@common/js/stores/window-store';
import {backgroundStore} from '@common/js/stores/background-store';
import {userStore} from '@common/js/stores/user-store';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    windows: windowStore,
    player: playerStore,
    background: backgroundStore,
    user: userStore
  },

  actions: {
    login(context, {user, remember}) {
      if (remember) {
        Cookies.set('token', user.token, {expires: 180});
      } else {
        Cookies.set('token', user.token);
      }

      context.commit('user/auth', user);
      context.commit('user/token', user.token);
    },

    async logout(context) {
      await context.dispatch('user/logout');
      Cookies.remove('token');
    },
  },

  getters: {
    token: () => Cookies.get('token'),
  },
})
