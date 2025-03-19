import { defineStore } from 'pinia'
import { enBackgroundMode, type Background } from '@app/types/types'
import { api } from '@app/api/api'
import { usePrefs } from '@app/composables/usePrefs'

interface State {
  background: Background
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): State => ({
    background: {
      image: undefined,
      color: '#008080',
      index: 0,
      mode: enBackgroundMode.RANDOM,
    }
  }),

  getters: {
    backgroundSrc (state) {
      if (state.background.image === undefined || state.background.mode === enBackgroundMode.SOLID) {
        return ''
      } else {
        return `url('${state.background.image.src}')`
      }
    },

    isBackgroundRandomMode (state) {
      return state.background.mode === enBackgroundMode.RANDOM
    }
  },

  actions: {
    saveBackground () {
      usePrefs.save<Background>('background', this.background)
    },

    loadSettings () {
      this.background = usePrefs.get<Background>('background', this.background)
    },

    loadRandomBackground () {
      this.background.image = undefined
      api.backgrounds.random().then(i => this.background.image = i.data)
    }
  }
})
