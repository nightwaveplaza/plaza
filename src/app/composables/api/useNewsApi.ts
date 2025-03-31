import { useApi } from '@app/composables/api/useApi.ts'
import type { NewsLatestResponse, NewsResponse } from '@app/types'

export function useNewsApi () {
  const getNews = () => {
    const instance = useApi<NewsResponse>()
    const fetch = (page: number) => instance.call({
      url: `v2/news/?page=${page}`
    })
    return { ...instance, fetch }
  }

  const getLastUpdated = () => {
    const instance = useApi<NewsLatestResponse>()
    const fetch = () => instance.call({
      url: `v2/news/latest`
    })
    return { ...instance, fetch }
  }

  return {
    getNews, getLastUpdated
  }
}
