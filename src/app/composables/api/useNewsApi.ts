import type { NewsLatestResource, NewsCollection } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useNewsApi (): {
  getNews: () => ApiHandler<NewsCollection, [{ page: number }]>;
  getLastUpdated: () => ApiHandler<NewsLatestResource, []>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getNews: createApiHandler<NewsCollection, [{ page: number }]>('v2/news'),
    getLastUpdated: createApiHandler<NewsLatestResource>('v2/news/latest')
  }
}
