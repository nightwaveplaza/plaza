import { defineStore } from 'pinia'
import { enBackgroundMode, type IfcBackground } from '@common/js/types'
import { backgrounds } from '@common/js/api/api'

interface State {
  background: IfcBackground,
  theme: string
}

export const useAppearanceStore = defineStore('appearanceStore', {
  state: (): State => ({
    background: {
      image: null,
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
      localStorage.setItem('prefs_theme', JSON.stringify(this.theme))
    },

    loadTheme (): string {
      const theme = JSON.parse(localStorage.getItem('prefs_theme'))
      this.theme = theme ?? 'win98'
    },

    saveBackground () {
      localStorage.setItem('prefs_background', JSON.stringify(this.background))
    },

    async loadBackground () {
      const bg: IfcBackground = JSON.parse(
        localStorage.getItem('prefs_background')
      )

      if (!bg || bg.mode === enBackgroundMode.RANDOM) {
        this.background.image = (await backgrounds.random()).data
      } else {
        this.background = bg
      }
    },
  },
})
