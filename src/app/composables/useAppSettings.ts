import _locales from '@locales/_locales.ts'
import { computed, ref } from 'vue'
import { usePrefs } from '@app/composables/usePrefs.ts'

const theme = ref(usePrefs.get<string>('theme', 'win98'))
const language = ref(usePrefs.get<string>('language', getDefaultLanguage()))
const lowQuality = ref(usePrefs.get<boolean>('low_quality', false))
const taskbarPosition = ref(usePrefs.get<string>('taskbar_position', getDefaultTaskbarPosition()))
const useHls = ref(usePrefs.get<boolean>('use_hls', true))

export function useAppSettings () {
  const setTheme = (t: string): void => {
    theme.value = t
    usePrefs.save<string>('theme', theme.value)
  }

  const setLanguage = (l: string): void => {
    language.value = l
    usePrefs.save<string>('language', language.value)
  }

  const setLowQuality = (v: boolean): void => {
    lowQuality.value = v
    usePrefs.save<boolean>('low_quality', lowQuality.value)
  }

  const setTaskbarPosition = (p: string): void => {
    taskbarPosition.value = p
    usePrefs.save<string>('taskbar_position', taskbarPosition.value)
  }

  const setUseHls = (v: boolean): void => {
    useHls.value = v
    usePrefs.save<boolean>('use_hls', useHls.value)
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
