import { useAppSettings } from '@app/composables/useAppSettings.ts';
import { onMounted, watch } from 'vue';
import { isMobile } from '@app/utils/helpers.ts';
import { Native } from '@mobile/bridge/native.ts';

const themeColors = {
  contrast: '#000000',
  contrast_2: '#000000',
  contrast_w: '#ffffff',
  desert: '#d5ccbb',
  lilac: '#aea8d9',
  rainy: '#8098b0',
  rose: '#cfafb7',
  slate: '#9db9c8',
  spruce: '#a2c8a9',
  win98: '#c0c0c0',
};

export function useThemeColor(): void {
  const { theme } = useAppSettings();

  // Set theme color to browser or Native app
  const setThemeColor = (): void => {
    const color = themeColors[theme.value as keyof typeof themeColors];
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);

    if (isMobile()) {
      Native.setThemeColor(color);
    }
  };

  watch(
    () => theme.value,
    () => setThemeColor(),
  );
  onMounted(() => setThemeColor());
}
