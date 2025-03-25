import { useAxios } from '@app/composables/api/useAxios.ts'
import type { NewsLatestResponse, NewsResponse } from '@app/types'

export function useNewsApi () {
  const getNews = () => {
    const instance = useAxios<NewsResponse>()
    const fetch = (page: number) => instance.call({
      url: `v2/news/?page=${page}`
    })
    return { ...instance, fetch }
  }

  const getLastUpdated = () => {
    const instance = useAxios<NewsLatestResponse>()
    const fetch = () => instance.call({
      url: `v2/news/last-updated`
    })
    return { ...instance, fetch }
  }

  return {
    getNews, getLastUpdated
  }
}
