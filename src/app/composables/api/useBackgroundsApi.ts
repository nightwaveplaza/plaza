import { useApi } from '@app/composables/api/useApi.ts'
import type { BackgroundResponse, BackgroundsResponse } from '@app/types'

export function useBackgroundsApi () {
  const getBackgrounds = () => {
    const instance = useApi<BackgroundsResponse>()
    const fetch = () => instance.call({
      url: `v2/backgrounds`
    })
    return { ...instance, fetch }
  }

  const getRandomBackground = () => {
    const instance = useApi<BackgroundResponse>()
    const fetch = () => instance.call({
      url: `v2/backgrounds/random`
    })
    return { ...instance, fetch }
  }

  return {
    getBackgrounds, getRandomBackground
  }
}
