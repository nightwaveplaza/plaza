import { useApi } from '@app/composables/api/useApi.ts'
import type { HistoryResponse } from '@app/types'

export function useHistoryApi () {
  const getHistory = () => {
    const instance = useApi<HistoryResponse>()
    const fetch = (page: number) => instance.call({
      url: `v2/history/?page=${page}`
    })
    return { ...instance, fetch }
  }

  return {
    getHistory
  }
}
