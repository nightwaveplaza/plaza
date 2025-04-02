import { computed, type ComputedRef, reactive, type UnwrapNestedRefs } from 'vue'
import { prefs } from '@app/utils/prefs.ts'
import { useBackgroundsApi } from '@app/composables/api'
import { type BackgroundImage, BackgroundMode, type BackgroundsResponse } from '@app/types'

/**
 * useBackgrounds composable
 * Manages the current background state and preferences
 */

export interface Background {
  image: BackgroundImage | null, // Current background image
  color: string,                 // HEX color for color background mode
  index: number,                 // Image index
  mode: BackgroundMode           // Background mode (RANDOM/COLOR/SINGLE)
}

// Reactive state loaded from persisted preferences
const background = reactive(prefs.get<Background>('background', {
  image: null,
  color: '#008080',
  index: 0,
  mode: BackgroundMode.RANDOM,
}))

/**
 * Main export function
 * Provides methods for cycling backgrounds and maintaining state
 */
export function useBackgrounds(): {
  background: UnwrapNestedRefs<Background>;
  fetch: () => Promise<BackgroundsResponse>;
  setRandomBackground: () => void;
  setColorBackground: (color?: string) => void;
  nextBackground: (direction: number) => void;
  isRandomMode: ComputedRef<boolean>;
  isColorMode: ComputedRef<boolean>;
  backgroundImage: ComputedRef<string>;
  backgroundColor: ComputedRef<string>;
  loadRandomBackground: () => void
} {
  const { getBackgrounds, getRandomBackground } = useBackgroundsApi()
  const { fetch, data } = getBackgrounds()
  const { fetch: fetchRandomBackground } = getRandomBackground()

  // Computed properties
  const backgroundList = computed(() => data.value?.data ?? null)
  const backgroundImage = computed(() =>
    background.image && background.mode != BackgroundMode.COLOR
      ? `url('${background.image.src}')`
      : ''
  )
  const backgroundColor = computed(() => background.color)
  const isRandomMode = computed(() => background.mode === BackgroundMode.RANDOM)
  const isColorMode = computed(() => background.mode === BackgroundMode.COLOR)

  /**
   * Sets random background from available list
   * Updates state and persists selection
   */
  const setRandomBackground = (): void => {
    if (!backgroundList.value || backgroundList.value.length == 0) {
      return
    }

    const randomIndex = Math.floor(Math.random() * backgroundList.value.length)

    background.mode = BackgroundMode.RANDOM
    background.index = randomIndex
    background.image = backgroundList.value[randomIndex]! // must exist
    saveBackground()
  }

  /**
   * Sets solid color background mode
   * @param color - Hex color string (defaults to teal)
   */
  const setColorBackground = (color?: string): void => {
    background.color = color ?? '#008080'
    background.mode = BackgroundMode.COLOR
    saveBackground()
  }

  /**
   * Cycles through backgrounds in specified direction
   * @param direction - 1 for next, -1 for previous
   */
  const nextBackground = (direction: number): void => {
    if (!backgroundList.value) {
      return setColorBackground()
    }

    background.index += direction

    if (background.index < 0) {
      background.index = backgroundList.value.length - 1
    } else if (background.index >= backgroundList.value.length) {
      background.index = 0
    }

    background.mode = BackgroundMode.SINGLE
    background.image = backgroundList.value[background.index]!
    saveBackground()
  }

  // Persists current background state to storage
  const saveBackground = (): void => {
    prefs.save<Background>('background', background)
  }

  /**
   * Fetches new random background from API
   * Does not change current mode - updates image only
   */
  const loadRandomBackground = (): void => {
    fetchRandomBackground().then(res => {
      background.image = res.data
    }).catch(() => {})
  }

  return {
    background, fetch, setRandomBackground, setColorBackground, nextBackground, isRandomMode, isColorMode,
    backgroundImage, backgroundColor, loadRandomBackground
  }
}
