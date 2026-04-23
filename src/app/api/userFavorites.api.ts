import api from '@app/api/index.ts';
import type { ResultResource, UserFavoritesCollection } from '@app/types';

// prettier-ignore
export const userFavoritesApi = {
  getFavorites: (data: { page: number }) =>
    api.get<UserFavoritesCollection>('v2/users/me/favorites', { params: data }),
  addFavorite: (data: { songId: string }) =>
    api.post<ResultResource>('/v2/users/me/favorites', { data }),
  deleteFavorite: (data: { id: number }) =>
    api.delete<ResultResource>(`v2/users/me/favorites/${data.id}`),
  exportFavorites: () =>
    api.post<{ link: string }>('v2/users/me/favorites/export'),
};
