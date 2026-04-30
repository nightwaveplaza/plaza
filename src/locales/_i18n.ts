import { createI18n } from 'vue-i18n';
import locales from '@locales/_locales';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: locales,

  postTranslation: (value, key) => {
    if (value === '') {
      const parts = key.split('.');
      let message: unknown = locales['en']!;

      for (const part of parts) {
        if (message && typeof message === 'object' && part in message) {
          message = (message as Record<string, unknown>)[part];
        } else {
          return value;
        }
      }

      return typeof message === 'string' ? message : value;
    }

    return value;
  },
});
