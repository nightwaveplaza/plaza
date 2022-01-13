import settings from '@common/js/extras/settings';

export const userStore = {
  namespaced: true,

  state: {
    auth: false,
    username: 'Guest',
    token: '1'
  },

  mutations: {
    auth(state, user) {
      state.auth = true;
      state.username = user.username;
    },

    token(state, token) {
      state.token = token;
    },

    logout(state) {
      state.auth = false;
      state.username = 'Guest';
    }
  },

  actions: {
    logout(context) {
      context.commit('logout');
      context.commit('player/reaction', 0, {root: true});
      settings.save('reaction', null);
    }
  },

  getters: {
    auth: state => state.auth,
    username: state => state.username,
    token: state => state.token
  },
}
