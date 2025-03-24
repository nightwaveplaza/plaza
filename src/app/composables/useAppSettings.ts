import _locales from '@locales/_locales.ts'
import { computed, ref } from 'vue'
import { prefs } from '@app/utils/prefs.ts'

enum PrefKeys {
  THEME = 'theme',
  LANGUAGE = 'language',
  LOW_QUALITY = 'low_quality',
  TASKBAR_POSITION = 'taskbar_position',
  USE_HLS = 'use_hls'
}

const theme = ref(prefs.get<string>(PrefKeys.THEME, 'win98'))
const language = ref(prefs.get<string>(PrefKeys.LANGUAGE, getDefaultLanguage()))
const lowQuality = ref(prefs.get<boolean>(PrefKeys.LOW_QUALITY, false))
const taskbarPosition = ref(prefs.get<string>(PrefKeys.TASKBAR_POSITION, getDefaultTaskbarPosition()))
const useHls = ref(prefs.get<boolean>(PrefKeys.USE_HLS, true))

export function useAppSettings () {
  const setTheme = (t: string): void => {
    theme.value = t
    prefs.save<string>(PrefKeys.THEME, theme.value)
  }

  const setLanguage = (l: string): void => {
    language.value = l
    prefs.save<string>(PrefKeys.LANGUAGE, language.value)
  }

  const setLowQuality = (v: boolean): void => {
    lowQuality.value = v
    prefs.save<boolean>(PrefKeys.LOW_QUALITY, lowQuality.value)
  }

  const setTaskbarPosition = (p: string): void => {
    taskbarPosition.value = p
    prefs.save<string>(PrefKeys.TASKBAR_POSITION, taskbarPosition.value)
  }

  const setUseHls = (v: boolean): void => {
    useHls.value = v
    prefs.save<boolean>(PrefKeys.USE_HLS, useHls.value)
  }

  const themeName = computed(() => `theme-${theme.value}`)

  return {
    theme, setTheme, language, setLanguage, lowQuality, setLowQuality,
    taskbarPosition, setTaskbarPosition, useHls, setUseHls, themeName
  }
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
