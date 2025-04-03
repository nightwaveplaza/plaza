import { type SongResource } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useSongsApi (): {
  getSong: () => ApiHandler<SongResource, [{ id: string }]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getSong: createApiHandler<SongResource, [{ id: string }]>(`v2/songs/{id}`)
  }
}
