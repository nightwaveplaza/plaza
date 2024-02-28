export const appearanceStore = {
  namespaced: true,

  state: {
    background: {
      image: '',
      color: '#008080'
    },
    theme: 'theme-win98'
  },

  mutations: {
    theme(state, theme) {
      state.theme = theme ? 'theme-' + theme : 'theme-win98';
    },

    background(state, background) {
      if (background.mode === 2) {
        state.background.image = ''
        state.background.color = background.color
      } else {
        state.background.image = `url('${background.image.src}')`
        state.background.color = ''
      }
    },
  },

  getters: {
    theme: state => state.theme,
    backgroundImage: state => state.background.image,
    backgroundColor: state => state.background.color,
  },
};
