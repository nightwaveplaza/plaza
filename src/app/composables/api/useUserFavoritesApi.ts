import { type ResultResource, type UserFavoritesCollection } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useUserFavoritesApi (): {
  getFavorites: () => ApiHandler<UserFavoritesCollection, [{ page: number }]>
  addFavorite: () => ApiHandler<ResultResource, [{ song_id: string }]>
  deleteFavorite: () => ApiHandler<ResultResource, [{ id: number }]>
  exportFavorites: () => ApiHandler<{ link: string }>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getFavorites: createApiHandler<UserFavoritesCollection, [{ page: number }]>('v2/users/me/favorites'),
    addFavorite: createApiHandler<ResultResource, [{ song_id: string }]>('v2/users/me/favorites', 'POST'),
    deleteFavorite: createApiHandler<ResultResource, [{ id: number }]>(`v2/users/me/favorites/{id}`, 'DELETE'),
    exportFavorites: createApiHandler<{ link: string }>(`v2/users/me/favorites/export`, 'POST')
  }
}
