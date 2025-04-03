import type { HistoryCollection } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useHistoryApi (): {
  getHistory: () => ApiHandler<HistoryCollection, [{ page: number }]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getHistory: createApiHandler<HistoryCollection, [{ page: number }]>('v2/history')
  }
}
