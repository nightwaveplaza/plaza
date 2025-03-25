import { useAxios } from '@app/composables/api/useAxios.ts'
import type { BackgroundResponse, BackgroundsResponse } from '@app/types'

export function useBackgroundsApi () {
  const getBackgrounds = () => {
    const instance = useAxios<BackgroundsResponse>()
    const fetch = () => instance.call({
      url: `v2/backgrounds`
    })
    return { ...instance, fetch }
  }

  const getRandomBackground = () => {
    const instance = useAxios<BackgroundResponse>()
    const fetch = () => instance.call({
      url: `v2/backgrounds/random`
    })
    return { ...instance, fetch }
  }

  return {
    getBackgrounds, getRandomBackground
  }
}
