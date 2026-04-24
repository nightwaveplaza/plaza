import { computed } from 'vue';
import { type BackgroundImage, BackgroundMode } from '@app/types';
import { isMobile } from '@app/utils/helpers.ts';
import { useLocalStorage } from '@vueuse/core';
import { useApi } from '@app/composables/useApi.ts';
import { backgroundApi } from '@app/api/background.api.ts';

/**
 * useBackgrounds composable
 * Manages the current background state and preferences
 */

export interface Background {
  image: BackgroundImage | null; // Current background image
  color: string; // HEX color for color background mode
  index: number; // Image index
}

// Reactive state loaded from persisted preferences
const background = useLocalStorage<Background>('background', {
  image: null,
  color: '#008080',
  index: 0,
});

const backgroundMode = useLocalStorage<BackgroundMode>('background_mode', BackgroundMode.RANDOM);

let backgroundList: BackgroundImage[] | null = null;

/**
 * Main export function
 * Provides methods for cycling backgrounds and maintaining state
 */
export function useBackgrounds() {
  const { execute: getBackgrounds } = useApi(backgroundApi.getBackgrounds);
  const { execute: getRandomBackground } = useApi(backgroundApi.getRandomBackground);

  const backgroundImage = computed(() =>
    background.value.image && !isColorMode.value ? `url('${background.value.image.src}')` : '',
  );
  const isRandomMode = computed(() => backgroundMode.value === BackgroundMode.RANDOM);
  const isColorMode = computed(() => backgroundMode.value === BackgroundMode.COLOR);
  const backgroundColor = computed(() =>
    isMobile() && !isColorMode.value ? 'transparent' : background.value.color,
  );

  const initBackground = async () => {
    if (backgroundList == null) {
      try {
        const res = await getBackgrounds();
        backgroundList = res.data;
      } catch {
        console.error('Failed to get backgrounds from background api');
        return;
      }
      if (isRandomMode.value) {
        setRandomBackground();
      }
    }
  };

  /**
   * Sets random background from available list
   * Updates state and persists selection
   */
  const setRandomBackground = (): void => {
    if (!backgroundList?.length) return;

    const randomIndex = Math.floor(Math.random() * backgroundList.length);

    backgroundMode.value = BackgroundMode.RANDOM;
    background.value.index = randomIndex;
    background.value.image = backgroundList[randomIndex]!;
  };

  /**
   * Sets solid color background mode
   * @param color - Hex color string (defaults to teal)
   */
  const setColorBackground = (color: string = '#008080'): void => {
    background.value.color = color;
    backgroundMode.value = BackgroundMode.COLOR;
  };

  /**
   * Cycles through backgrounds in specified direction
   * @param direction - 1 for next, -1 for previous
   */
  const nextBackground = (direction: number): void => {
    if (!backgroundList?.length) return setColorBackground();

    let newIndex = background.value.index + direction;

    if (newIndex < 0) newIndex = backgroundList.length - 1;
    else if (newIndex >= backgroundList.length) newIndex = 0;

    background.value.index = newIndex;
    backgroundMode.value = BackgroundMode.SINGLE;
    background.value.image = backgroundList[newIndex]!;
  };

  const loadRandomBackground = async (): Promise<void> => {
    try {
      const res = await getRandomBackground();
      background.value.image = res.data;
    } catch (error) {
      console.error('Failed to load random background', error);
    }
  };

  return {
    initBackground,
    background,
    setRandomBackground,
    setColorBackground,
    nextBackground,
    isRandomMode,
    isColorMode,
    backgroundImage,
    backgroundColor,
    loadRandomBackground,
  };
}
