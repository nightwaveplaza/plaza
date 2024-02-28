export const windowStore = {
  namespaced: true,

  state: {
    windows: [],
    minimized: [],
    activeWindow: '',
    activeZIndex: 100,
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

    title(state, {name, title}) {
      const index = state.windows.map(e => e.name).indexOf(name);
      state.windows[index].title = title;
    },

    minimize(state, name) {
      state.minimized.push(name);
    },

    restore(state, name) {
      state.minimized = state.minimized.filter(n => n !== name);
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

    updateTitle(context, {name, title}) {
      if (context.getters.isWindowOpen(name)) {
        context.commit('title', {name, title});
      }
    },

    minimize(context, name) {
      if (!context.getters.isWindowMinimized(name)) {
        context.commit('minimize', name);
      }
    },

    restore(context, name) {
      if (context.getters.isWindowMinimized(name)) {
        context.commit('restore', name);
        context.commit('pullUp', name);
      }
    },
  },

  getters: {
    windows: state => state.windows,
    isWindowOpen: state => name => state.windows.some(w => w.name === name),
    isWindowMinimized: state => name => state.minimized.indexOf(name) >= 0,
    alerts: state => state.windows.filter(w => w.name.includes('alert-')),
    songWindows: state => state.windows.filter(w => w.name.includes('song-')),
    activeWindow: state => state.activeWindow,
    globalZ: state => state.activeZIndex,
  },
};
