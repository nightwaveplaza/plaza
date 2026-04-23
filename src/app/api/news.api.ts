import type { NewsCollection, NewsLatestResource } from '@app/types'
import api from '@app/api/index.ts'

export const newsApi = {
  getNews: (data: { page: number }) => api.get<NewsCollection>('v2/news', {params: data}).then(res => res.data),
  getLastUpdated: () => api.get<NewsLatestResource>('v2/news/latest').then(res => res.data)
}