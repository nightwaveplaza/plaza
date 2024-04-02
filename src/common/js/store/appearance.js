export const appearanceStore = {
  namespaced: true,

  state: {
    background: {
      image: '',
      color: '#008080',
      index: 0,
      mode: 0,
    },
    theme: 'win98'
  },

  mutations: {
    theme(state, theme) {
      state.theme = theme
    },

    background(state, background) {
      state.background = background
      // if (background.mode === 2) {
      //   state.background.image = ''
      //   state.background.color = background.color
      // } else {
      //   state.background.image = `url('${background.image.src}')`
      //   state.background.color = ''
      // }
    },
  },

  getters: {
    theme: state => state.theme,
    backgroundImage: state => state.background.image,
    backgroundColor: state => state.background.color,
    background: state => state.background
  }
};
