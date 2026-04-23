import api from '@app/api/index.ts'
import type { ResultResource, UserFavoritesCollection } from '@app/types'

export const userFavoritesApi = {
  getFavorites: (data: {page: number}) => api.get<UserFavoritesCollection>('v2/users/me/favorites', { params: data}).then(res => res.data),
  addFavorite: (data: {songId: string}) => api.post<ResultResource>('/v2/users/me/favorites', { data }).then(res => res.data),
  deleteFavorite: (data: {id: number}) => api.delete<ResultResource>(`v2/users/me/favorites/${data.id}`).then(res => res.data),
  exportFavorites: () => api.post<{link: string}>('v2/users/me/favorites/export').then(res => res.data)
}