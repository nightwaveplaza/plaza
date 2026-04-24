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

function getDefaultLanguage(): string {
  const lang = window.navigator.language;
  const langShort = lang.slice(0, 2);

  if (lang in _locales) return lang;
  if (langShort in _locales) return langShort;
  return 'en';
}

function getDefaultTaskbarPosition(): string {
  return /iPad|iPhone/i.test(window.navigator.userAgent) ? 'top' : 'bottom';
}

const theme = useLocalStorage(PrefKeys.THEME, 'win98');
const language = useLocalStorage(PrefKeys.LANGUAGE, getDefaultLanguage());
const lowQuality = useLocalStorage(PrefKeys.LOW_QUALITY, false);
const taskbarPosition = useLocalStorage(PrefKeys.TASKBAR_POSITION, getDefaultTaskbarPosition());
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
