import { computed, reactive } from 'vue'
import { usePrefs } from '@app/composables/usePrefs.ts'
import { useBackgroundsApi } from '@app/composables/api/useBackgroundsApi.ts'

export interface Background {
  image: BackgroundImage | null,
  color: string,
  index: number,
  mode: BackgroundMode
}

export enum BackgroundMode {
  RANDOM,
  SINGLE,
  COLOR
}

export interface BackgroundImage {
  id: number,
  filename: string
  author: string
  author_link: string
  source: string
  source_link: string
  num: string
  src: string
  video_src: string
}

const background = reactive(usePrefs.get<Background>('background', {
  image: null,
  color: '#008080',
  index: 0,
  mode: BackgroundMode.RANDOM,
}))

export function useBackgrounds() {
  const { getBackgrounds, getRandomBackground } = useBackgroundsApi()
  const { fetch, data } = getBackgrounds()
  const { fetch: fetchRandomBackground } = getRandomBackground()

  // Computed
  const backgroundList = computed(() => data.value?.data ?? null)
  const backgroundImage = computed(() =>
    background.image && background.mode != BackgroundMode.COLOR ? `url('${background.image.src}')` : ''
  )
  const backgroundColor = computed(() => background.color)
  const isRandomMode = computed(() => background.mode === BackgroundMode.RANDOM)
  const isColorMode = computed(() => background.mode === BackgroundMode.COLOR)

  const setRandomBackground = () => {
    if (!backgroundList.value) {
      return
    }

    const randomIndex = Math.floor(Math.random() * backgroundList.value.length)

    background.mode = BackgroundMode.RANDOM
    background.index = randomIndex
    background.image = backgroundList.value[randomIndex]! // must exist
    saveBackground()
  }

  const setColorBackground = (color?: string) => {
    background.color = color ?? '#008080'
    background.mode = BackgroundMode.COLOR
    saveBackground()
  }

  const nextBackground = (direction: number) => {
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

  const saveBackground = () => {
    usePrefs.save<Background>('background', background)
  }

  const loadRandomBackground = () => {
    fetchRandomBackground().then(res => {
      background.image = res
    })
  }

  return {
    background, fetch, setRandomBackground, setColorBackground, nextBackground, isRandomMode, isColorMode,
    backgroundImage, backgroundColor, loadRandomBackground
  }
}
