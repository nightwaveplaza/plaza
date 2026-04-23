import type { HistoryCollection } from '@app/types'
import api from '@app/api/index.ts'

export const historyApi = {
  getHistory: (data: { page: number }) => api.get<HistoryCollection>('v2/history', {params: data}).then(res => res.data),
}