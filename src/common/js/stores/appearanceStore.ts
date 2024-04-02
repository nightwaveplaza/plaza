import { defineStore } from 'pinia'
import { enBackgroundMode, type Background } from '@common/js/types'
import { api } from '@common/js/api/api'
import { prefs } from '@common/js/extras/prefs'

interface State {
  background: Background,
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
      if (state.background.image === undefined || state.background.mode === enBackgroundMode.SOLID) {
        return ''
      } else {
        return `url('${state.background.image.src}')`
      }
    },

    themeName (state) {
      return 'theme-' + state.theme
    },

    isBackgroundRandomMode(state) {
      return state.background.mode === enBackgroundMode.RANDOM
    }
  },

  actions: {
    saveTheme () {
      prefs.save('theme', this.theme)
    },

    saveBackground () {
      prefs.save('background', this.background)
    },

    loadSettings() {
      this.background = prefs.getObj<Background>('background', this.background)!
      this.theme = prefs.getStr('theme', 'win98')
    },

    loadRandomBackground () {
      this.background.image = undefined
      api.backgrounds.random().then(i => this.background.image = i.data)
    }
  }
})
