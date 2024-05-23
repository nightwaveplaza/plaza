import { defineStore } from 'pinia'
import { enBackgroundMode, type Background } from '@common/js/types'
import { api } from '@common/js/api/api'
import { prefs } from '@common/js/extras/prefs'
import _locales from '@locales/_locales.ts'

interface State {
  background: Background,
  theme: string,
  taskbarPosition: string,
  language: string,
  lowQuality: number
}

function getDefaultLanguage(): string {
  const lang = window.navigator.language
  if (_locales.hasOwnProperty(lang)) {
    return lang
  } else {
    return 'en'
  }
}

function getDefaultTaskbarPosition (): string {
  let userAgent = window.navigator.userAgent
  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    return 'top'
  } else {
    return 'bottom'
  }
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): State => ({
    background: {
      image: undefined,
      color: '#008080',
      index: 0,
      mode: enBackgroundMode.RANDOM,
    },
    theme: 'win98',
    taskbarPosition: 'bottom',
    language: 'en',
    lowQuality: 0
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
    saveBackground () {
      prefs.save<Background>('background', this.background)
    },

    saveTheme () {
      prefs.save<string>('theme', this.theme)
    },

    saveTaskbarPosition() {
      prefs.save<string>('taskbar_position', this.taskbarPosition)
    },

    saveLanguage() {
      prefs.save<string>('language', this.language)
    },

    saveQuality() {
      prefs.save<number>('low_quality', this.lowQuality)
    },

    loadSettings() {
      this.background = prefs.get<Background>('background', this.background)
      this.theme = prefs.get<string>('theme', 'win98')
      this.language = prefs.get<string>('language', getDefaultLanguage())
      this.lowQuality = prefs.get<number>('low_quality', 0)
      this.taskbarPosition = prefs.get<string>('taskbar_position', getDefaultTaskbarPosition())
    },

    loadRandomBackground () {
      this.background.image = undefined
      api.backgrounds.random().then(i => this.background.image = i.data)
    }
  }
})
