

import { useStore } from 'vuex'

export const windowsMixin = {

  openWindow(name) {
    store.dispatch('windows/open', {name}).then();
  },

  methods: {
    /**
     * Open window
     * @param name
     */
    openWindow(name) {
      this.$store.dispatch('windows/open', {name}).then();
    },

    /**
     * Close window
     * @param name
     */
    closeWindow(name) {
      if (name) {
        this.$store.dispatch('windows/close', name).then();
      } else {
        this.$refs.window.close();
      }
    },

    /**
     * Show alert window
     * @param text
     * @param title
     * @param type
     */
    alert(text, title, type = 'warn') {
      const id = Math.random().toString(36).substr(2, 9);
      this.$store.dispatch('windows/open',
          {name: 'alert-' + id, text, title, type}).then();
    },

    /**
     * Show song info window
     * @param id
     */
    songInfo(id) {
      this.$store.dispatch('windows/open', {name: 'song-' + id, id}).then();
    },
  },
};
