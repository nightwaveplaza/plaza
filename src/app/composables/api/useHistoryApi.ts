import { useAxios } from '@app/composables/api/useAxios.ts'
import type { HistoryResponse } from '@app/types'

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
