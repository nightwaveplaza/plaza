import { type RatingsCollection, RatingsRange } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useRatingsApi (): {
  getRatings: () => ApiHandler<RatingsCollection, [{ range: RatingsRange }, { page: number }]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getRatings: createApiHandler<RatingsCollection, [{ range: RatingsRange }, { page: number }]>(`v2/ratings/{range}`)
  }
}
