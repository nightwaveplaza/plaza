import { useAxios } from '@app/composables/api/useAxios.ts'
import type { Ref } from 'vue'
import type { PaginatedResponse } from '@app/types/types.ts'

export interface NewsResponse extends PaginatedResponse {
  data: {
    text: string
    author: string
    created_at: number
  }[]
}

export interface NewsLatestResponse {
  id: number
  updated_at: number
}

export function useNewsApi () {
  const getNews = (page: Ref<number>) => {
    const instance = useAxios<NewsResponse>()
    const fetch = () => instance.call({
      url: `v2/news/?page=${page.value}`
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
