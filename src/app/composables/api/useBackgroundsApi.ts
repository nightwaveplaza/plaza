import { useAxios } from '@app/composables/api/useAxios.ts'
import type { BackgroundImage } from '@app/composables/useBackgrounds.ts'

interface BackgroundResponse {
  data: BackgroundImage[]
}

export function useBackgroundsApi () {
  const getBackgrounds = () => {
    const instance = useAxios<BackgroundResponse>()
    const fetch = () => instance.call({
      url: `v2/backgrounds`
    })
    return { ...instance, fetch }
  }

  const getRandomBackground = () => {
    const instance = useAxios<BackgroundImage>()
    const fetch = () => instance.call({
      url: `v2/backgrounds/random`
    })
    return { ...instance, fetch }
  }

  return {
    getBackgrounds, getRandomBackground
  }
}
