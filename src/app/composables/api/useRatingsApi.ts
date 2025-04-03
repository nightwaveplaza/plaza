import { type RatingsCollection } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useRatingsApi (): {
  getRatings: () => ApiHandler<RatingsCollection, [{ page: number, range: string }]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getRatings: createApiHandler<RatingsCollection, [{ page: number, range: string }]>(`v2/ratings/{range}`)
  }
}
