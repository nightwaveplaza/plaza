export const backgroundStore = {
  namespaced: true,

  state: {
    backgrounds: false,
    background: {},
  },

  mutations: {
    backgrounds(state, backgrounds) {
      state.backgrounds = backgrounds;
    },

    background(state, background) {
      state.background = background;
    },
  },

  getters: {
    backgrounds: state => state.backgrounds,
    background: state => state.background,
  },
};
