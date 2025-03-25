import { useAxios } from '@app/composables/api/useAxios.ts'
import { type RatingsResponse, ReactionsRange } from '@app/types'

export function useRatingsApi () {
  const getReactions = () => {
    const instance = useAxios<RatingsResponse>()
    const fetch = (range: ReactionsRange, page: number) => instance.call({
      url: `v2/reactions/${range}/?page=${page}`
    })
    return { ...instance, fetch }
  }

  return {
    getReactions
  }
}
