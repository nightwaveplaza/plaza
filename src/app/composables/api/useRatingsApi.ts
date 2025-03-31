import { useApi } from '@app/composables/api/useApi.ts'
import { type RatingsResponse, RatingsRange } from '@app/types'

export function useRatingsApi () {
  const getRatings = () => {
    const instance = useApi<RatingsResponse>()
    const fetch = (range: RatingsRange, page: number) => instance.call({
      url: `v2/ratings/${range}/?page=${page}`
    })
    return { ...instance, fetch }
  }

  return {
    getRatings
  }
}
