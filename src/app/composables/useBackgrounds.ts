import { computed } from 'vue'
import { useBackgroundsApi } from '@app/composables/api'
import { type BackgroundImage, BackgroundMode } from '@app/types'
import { isMobile } from '@app/utils/helpers.ts'
import { useLocalStorage } from '@vueuse/core'

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
const background = useLocalStorage<Background>('background', {
  image: null,
  color: '#008080',
  index: 0,
  mode: BackgroundMode.RANDOM,
})

/**
 * Main export function
 * Provides methods for cycling backgrounds and maintaining state
 */
export function useBackgrounds() {
  const { getBackgrounds, getRandomBackground } = useBackgroundsApi()
  const { fetch, data } = getBackgrounds()
  const { fetch: fetchRandomBackground } = getRandomBackground()

  // Computed properties
  const backgroundList = computed(() => data.value?.data ?? null)
  const backgroundImage = computed(() =>
    background.value.image && !isColorMode.value
      ? `url('${background.value.image.src}')`
      : ''
  )
  const isRandomMode = computed(() => background.value.mode === BackgroundMode.RANDOM)
  const isColorMode = computed(() => background.value.mode === BackgroundMode.COLOR)
  const backgroundColor = computed(() =>
    isMobile() && !isColorMode.value ? 'transparent' : background.value.color
  )

  /**
   * Sets random background from available list
   * Updates state and persists selection
   */
  const setRandomBackground = (): void => {
    const list = backgroundList.value
    if (!list?.length) return

    const randomIndex = Math.floor(Math.random() * list.length)

    background.value.mode = BackgroundMode.RANDOM
    background.value.index = randomIndex
    background.value.image = list[randomIndex]!
  }

  /**
   * Sets solid color background mode
   * @param color - Hex color string (defaults to teal)
   */
  const setColorBackground = (color: string = '#008080'): void => {
    background.value.color = color
    background.value.mode = BackgroundMode.COLOR
  }

  /**
   * Cycles through backgrounds in specified direction
   * @param direction - 1 for next, -1 for previous
   */
  const nextBackground = (direction: number): void => {
    const list = backgroundList.value
    if (!list?.length) return setColorBackground()

    let newIndex = background.value.index + direction

    if (newIndex < 0) newIndex = list.length - 1
    else if (newIndex >= list.length) newIndex = 0

    background.value.index = newIndex
    background.value.mode = BackgroundMode.SINGLE
    background.value.image = list[newIndex]!
  }

  const loadRandomBackground = async (): Promise<void> => {
    try {
      const res = await fetchRandomBackground()
      background.value.image = res.data
    } catch (error) {
      console.error('Failed to load random background', error)
    }
  }

  return {
    background, fetch, setRandomBackground, setColorBackground, nextBackground, isRandomMode, isColorMode,
    backgroundImage, backgroundColor, loadRandomBackground
  }
}
