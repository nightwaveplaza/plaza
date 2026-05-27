import _locales from '@locales/_locales.ts';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

enum PrefKeys {
  THEME = 'theme',
  LANGUAGE = 'language',
  LOW_QUALITY = 'low_quality',
  TASKBAR_POSITION = 'taskbar_position',
  USE_HLS = 'use_hls',
}

function getDefaultLocale() {
  const userLocale = window.navigator.language.toLowerCase();

  const localeAliases: Record<string, string> = {
    'zh-hant': 'zh-TW',
    'zh-hk': 'zh-TW',
    'zh-mo': 'zh-TW',
    'zh-hans': 'zh-CN',
    'zh-sg': 'zh-CN',
  };

  if (userLocale in localeAliases) {
    return localeAliases[userLocale];
  }

  const availableLocales = Object.keys(_locales);
  const exactMatch = availableLocales.find(l => l.toLowerCase() === userLocale);
  if (exactMatch) return exactMatch;

  const langShort = userLocale.slice(0, 2);

  if (langShort === 'zh') return 'zh-CN';

  const fallbackLocale = availableLocales.find(l => l.toLowerCase().startsWith(langShort + '-'));
  if (fallbackLocale) return fallbackLocale;

  return 'en-US';
}

const theme = useLocalStorage(PrefKeys.THEME, 'win98');
const language = useLocalStorage(PrefKeys.LANGUAGE, getDefaultLocale());
const lowQuality = useLocalStorage(PrefKeys.LOW_QUALITY, false);
const taskbarPosition = useLocalStorage(PrefKeys.TASKBAR_POSITION, 'bottom');
const useHls = useLocalStorage(PrefKeys.USE_HLS, true);

export function useAppSettings() {
  const themeName = computed(() => `theme-${theme.value}`);

  return {
    theme,
    language,
    lowQuality,
    taskbarPosition,
    useHls,
    themeName,
  };
}
