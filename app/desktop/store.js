import Vuex from 'vuex';
import Vue from 'vue';
import Cookies from 'js-cookie';
import {playerStore} from '@base/store/player';
import {windowStore} from '@base/store/window';
import {backgroundStore} from '@base/store/background';
import {userStore} from '@base/store/user';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    windows: windowStore,
    player: playerStore,
    background: backgroundStore,
    user: userStore,
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
    viewVersion: () => process.env.version,
  },
});
