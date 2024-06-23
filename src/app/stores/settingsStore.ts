import { defineStore } from 'pinia'
import { enBackgroundMode, type Background } from '@app/types/types'
import { api } from '@app/api/api'
import { usePrefs } from '@app/composables/usePrefs'
import _locales from '@locales/_locales'

interface State {
  background: Background,
  theme: string,
  taskbarPosition: string,
  language: string,
  lowQuality: boolean
}

function getDefaultLanguage (): string {
  const lang = window.navigator.language
  const langShort = window.navigator.language.slice(0, 2)

  if (Object.prototype.hasOwnProperty.call(_locales, lang)) {
    return lang
  }
  if (Object.prototype.hasOwnProperty.call(_locales, langShort)) {
    return langShort
  }

  return 'en'
}

function getDefaultTaskbarPosition (): string {
  const userAgent = window.navigator.userAgent
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
    lowQuality: false
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

    isBackgroundRandomMode (state) {
      return state.background.mode === enBackgroundMode.RANDOM
    }
  },

  actions: {
    saveBackground () {
      usePrefs.save<Background>('background', this.background)
    },

    saveTheme () {
      usePrefs.save<string>('theme', this.theme)
    },

    saveTaskbarPosition () {
      usePrefs.save<string>('taskbar_position', this.taskbarPosition)
    },

    saveLanguage () {
      usePrefs.save<string>('language', this.language)
    },

    saveQuality () {
      usePrefs.save<boolean>('low_quality', this.lowQuality)
    },

    loadSettings () {
      this.background = usePrefs.get<Background>('background', this.background)
      this.theme = usePrefs.get<string>('theme', 'win98')
      this.language = usePrefs.get<string>('language', getDefaultLanguage())
      this.lowQuality = usePrefs.get<boolean>('low_quality', false)
      this.taskbarPosition = usePrefs.get<string>('taskbar_position', getDefaultTaskbarPosition())
    },

    loadRandomBackground () {
      this.background.image = undefined
      api.backgrounds.random().then(i => this.background.image = i.data)
    }
  }
})
