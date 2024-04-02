import Repository from '@common/js/api/axios'
import type {
  UserLogin,
  UserEdit,
  UserRegister,
  UserReset,
  UserResetConfirm,
  ReactResponse,
  HistoryResponse,
  UserResponse,
  RatingsResponse,
  FavoritesResponse,
  BackgroundImage,
  NewsLatestResponse, StatusResponse, NewsResponse, SongResponse,
} from '@common/js/types'

export const api = {
  status: {
    get: () => Repository.get<StatusResponse>('status'),
    getOsd: () => Repository.get<(string | number)[]>('status/on-screen-data'),
  },

  news: {
    latest: () => Repository.get<NewsLatestResponse>(`news/latest`),
    get: (page: number) => Repository.get<NewsResponse>(`news/${page}`),
  },

  history: {
    get: (page: number) => Repository.get<HistoryResponse>(`history/${page}`),
  },

  reactions: {
    react: (reaction: number) => Repository.post<ReactResponse>('reactions', { reaction })
  },

  ratings: {
    get: (range: string, page: number) => Repository.get<RatingsResponse>(`ratings/${range}/${page}`),
  },

  songs: {
    get: (id: string) => Repository.get<SongResponse>(`songs/${id}`),
  },

  backgrounds: {
    get: () => Repository.get<BackgroundImage[]>('backgrounds'),
    random: () => Repository.get<BackgroundImage>('backgrounds/random'),
  },

  user: {
    login: (data: UserLogin) => Repository.post('user/auth', data),
    register: (data: UserRegister) => Repository.post('user/register', data),
    get: () => Repository.get<UserResponse>('user'),
    edit: (data: UserEdit) => Repository.put('user', data),
    favorites: (page: number) => Repository.get<FavoritesResponse>(`user/favorites/${page}`),
    addFavorite: (song_id: string) => Repository.post('user/favorites', { song_id }),
    deleteFavorite: (favoriteId: number) => Repository.delete(`user/favorites/${favoriteId}`),
    reset: (data: UserReset) => Repository.post('user/reset', data),
    confirmReset: (data: UserResetConfirm) => Repository.post('user/reset/confirm', data),
    logout: () => Repository.post('user/logout')
  },
}
