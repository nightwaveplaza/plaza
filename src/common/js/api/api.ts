import Repository from '@common/js/api/axios'
import type {
  ifcUserLogin,
  ifcUserEdit,
  ifcUserRegister,
  ifcUserReset,
  ifcUserResetConfirm,
  ifcReactResponse,
  ifcHistoryResponse,
  ifcUserResponse,
  ifcRatingsResponse, ifcFavoritesResponse,
} from '@common/js/types'

/**
 * Status
 */
export const status = {
  get: () => Repository.get('status'),
  getOsd: () => Repository.get('status/on-screen-data'),
}

/**
 * Backgrounds
 */
export const backgrounds = {
  get: () => Repository.get('backgrounds'),
  random: () => Repository.get('backgrounds/random'),
}

/**
 * Songs
 */
export const songs = {
  get: (id: string) => Repository.get(`songs/${id}`),
}

/**
 * Play history
 */
export const history = {
  get: (page: number) => Repository.get<ifcHistoryResponse>(`history/${page}`),
}

/**
 * Reactions
 */
export const reactions = {
  react: (reaction: number) => Repository.post<ifcReactResponse>('reactions', { reaction }),
}

/**
 * Ratings
 */
export const ratings = {
  get: (range: string, page: number) => Repository.get<ifcRatingsResponse>(
    `ratings/${range}/${page}`),
}

/**
 * News
 */
export const news = {
  get: (page: number) => Repository.get(`news/${page}`),
  latest: () => Repository.get(`news/latest`),
}

/**
 * User
 */
export const user = {
  get: () => Repository.get<ifcUserResponse>('user'),
  login: (data: ifcUserLogin) => Repository.post('user/auth', data),
  register: (data: ifcUserRegister) => Repository.post('user/register', data),
  edit: (data: ifcUserEdit) => Repository.put('user', data),
  reset: (data: ifcUserReset) => Repository.post('user/reset', data),
  confirmReset: (data: ifcUserResetConfirm) => Repository.post('user/reset/confirm', data),
  logout: () => Repository.post('user/logout'),
  favorites: (page: number) => Repository.get<ifcFavoritesResponse>(`user/favorites/${page}`),
  deleteFavorite: (favoriteId: number) => Repository.delete(`user/favorites/${favoriteId}`),
  addFavorite: (song_id: string) => Repository.post('user/favorites', { song_id }),
}
