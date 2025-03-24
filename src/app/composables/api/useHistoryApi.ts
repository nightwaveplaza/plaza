import { useAxios } from '@app/composables/api/useAxios.ts'
import type { PaginatedResponse } from '@app/types/types.ts'

export interface HistoryResponse extends PaginatedResponse {
  data: {
    played_at: number
    id: string
    artist: string
    title: string
  }[],
  meta_extra: {
    from_date: number,
    to_date: number
  }
}

export function useHistoryApi () {
  const getHistory = (page: number) => {
    const instance = useAxios<HistoryResponse>()
    const fetch = () => instance.call({
      url: `v2/history/?page=${page}`
    })
    return { ...instance, fetch }
  }

  return {
    getHistory
  }
}
