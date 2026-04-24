import { useI18n } from 'vue-i18n';
import { useAppSettings } from '@app/composables/useAppSettings.ts';
import { useBackgrounds } from '@app/composables/useBackgrounds.ts';
import { Native } from '@mobile/bridge/native.ts';
import { watch } from 'vue';
import { useEventListener } from '@vueuse/core';

export function useNativeEvents(): {
  updateBackgroundNative: () => void;
} {
  const i18n = useI18n();

  const { lowQuality, language } = useAppSettings();
  const { background, isColorMode } = useBackgrounds();

  /**
   * Android events
   */
  useEventListener(window, 'app:start', () => updateBackgroundNative);

  // Watch background for changes
  watch(() => background.value.color, updateBackgroundNative);
  watch(() => background.value.image, updateBackgroundNative);

  // Watch audio quality
  watch(
    () => lowQuality.value,
    () => {
      Native.setAudioQuality(lowQuality.value);
    },
  );

  // Watch language change
  watch(
    () => language.value,
    () => {
      i18n.locale.value = language.value;
      Native.setLanguage(language.value);
    },
  );

  function updateBackgroundNative(): void {
    if (typeof AndroidInterface !== 'undefined') {
      Native.setBackground(isColorMode.value ? 'solid' : background.value.image!.src);
    } else {
      Native.setBackground(isColorMode.value ? 'solid' : background.value.image!.video_src);
    }
  }

  return { updateBackgroundNative };
}
