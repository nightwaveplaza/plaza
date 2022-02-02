export const windowStore = {
  namespaced: true,

  state: {
    windows: [],
    activeWindow: '',
    activeZIndex: 100,
    isPlayerMinimized: false,
    alerts: [],

    songInfoIds: [],
  },

  mutations: {
    open(state, window) {
      state.windows.push(window);
    },

    close(state, name) {
      state.windows = state.windows.filter(w => w.name !== name);
    },

    pullUp(state, name = null) {
      state.activeWindow = name ?? state.windows[state.windows.length - 1].name;
      state.activeZIndex++;
    },

    minimize(state, mini) {
      state.isPlayerMinimized = mini;
    },
  },

  actions: {
    open(context, window) {
      if (!context.getters.isWindowOpen(window.name)) {
        context.commit('open', window);
      }
      context.commit('pullUp', window.name);
    },

    close(context, name) {
      context.commit('close', name);
      const windows = context.getters.windows;
      if (windows.length > 0) {
        context.commit('pullUp', windows[windows.length - 1].name);
      }
    },
  },

  getters: {
    windows: state => state.windows,
    isWindowOpen: state => name => state.windows.some(w => w.name === name),
    alerts: state => state.windows.filter(w => w.name.includes('alert-')),
    songInfoWindows: state => state.windows.filter(w => w.name.includes('song-')),
    activeWindow: state => state.activeWindow,
    globalZ: state => state.activeZIndex,
    isPlayerMinimized: state => state.isPlayerMinimized
  },
};
