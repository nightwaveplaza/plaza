import { defineStore } from 'pinia'
import { enBackgroundMode, type ifcBackground } from '@common/js/types'
import { backgrounds } from '@common/js/api/api'
import { prefs } from '@common/js/extras/prefs'

interface State {
  background: ifcBackground,
  theme: string
}

export const useAppearanceStore = defineStore('appearanceStore', {
  state: (): State => ({
    background: {
      image: undefined,
      color: '#008080',
      index: 0,
      mode: enBackgroundMode.RANDOM,
    },
    theme: 'win98',
  }),

  getters: {
    backgroundSrc (state) {
      return state.background.image
        ? `url('${state.background.image.src}')`
        : ''
    },
    themeName (state) {
      return 'theme-' + state.theme
    },
  },

  actions: {
    saveTheme () {
      prefs.save('theme', this.theme)
    },

    loadTheme () {
      this.theme = prefs.getStr('theme', 'win98')
    },

    saveBackground () {
      prefs.save('background', this.background)
    },

    async loadBackground () {
      const bg: ifcBackground = prefs.getObj('background')

      if (!bg || bg.mode === enBackgroundMode.RANDOM) {
        this.background.image = (await backgrounds.random()).data
      } else {
        this.background = bg
      }
    },
  },
})
