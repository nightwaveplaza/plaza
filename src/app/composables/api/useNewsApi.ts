import { useAxios } from '@app/composables/api/useAxios.ts'
import type { PaginatedResponse } from '@app/types/types.ts'

interface NewsResponse extends PaginatedResponse {
  data: {
    text: string
    author: string
    created_at: number
  }[]
}

interface NewsLatestResponse {
  id: number
  updated_at: number
}

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
