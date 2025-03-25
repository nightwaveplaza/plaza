import { useAxios } from '@app/composables/api/useAxios.ts'
import type { PaginatedResponse } from '@app/types/types.ts'

interface HistoryResponse extends PaginatedResponse {
  data: {
    played_at: number
    song: Song
  }[],
  meta_extra: {
    from_date: number,
    to_date: number
  }
}

export interface Song {
  'id': string,
  'artist': string,
  'album': string,
  'title': string,
  'length': string,
  'artwork_src': string,
  'artwork_sm_src': string,
  'preview_src': string
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
