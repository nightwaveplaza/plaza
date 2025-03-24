import { useAxios } from '@app/composables/api/useAxios.ts'
import type { PaginatedResponse } from '@app/types/types.ts'

interface HistoryResponse extends PaginatedResponse {
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
  const getHistory = () => {
    const instance = useAxios<HistoryResponse>()
    const fetch = (page: number) => instance.call({
      url: `v2/history/?page=${page}`
    })
    return { ...instance, fetch }
  }

  return {
    getHistory
  }
}
