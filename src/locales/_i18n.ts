import { createI18n } from 'vue-i18n'
import locales from '@locales/_locales'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: locales
})
