import Repository from '@app/api/axios'
import type {
  UserLogin,
  UserEdit,
  UserRegister,
  UserReset,
  UserResetConfirm,
  ReactResponse,
  UserResponse,
  FavoritesResponse,
  StatusResponse,
} from '@app/types/types'
import type { AxiosResponse } from 'axios'

export const api = {
  status: {
    get: ():
      Promise<AxiosResponse<StatusResponse>> =>
      Repository.get<StatusResponse>('status'),
  },

  reactions: {
    react: (reaction: number):
      Promise<AxiosResponse<ReactResponse>> =>
      Repository.post<ReactResponse>('reactions', { reaction }),
  },

  user: {
    login: (data: UserLogin):
      Promise<AxiosResponse> =>
      Repository.post('user/auth', data),
    register: (data: UserRegister):
      Promise<AxiosResponse> =>
      Repository.post('user/register', data),
    get: ():
      Promise<AxiosResponse<UserResponse>> =>
      Repository.get<UserResponse>('user'),
    edit: (data: UserEdit):
      Promise<AxiosResponse> =>
      Repository.put('user', data),
    favorites: (page: number):
      Promise<AxiosResponse<FavoritesResponse>> =>
      Repository.get<FavoritesResponse>(`user/favorites/${page}`),
    addFavorite: (song_id: string):
      Promise<AxiosResponse> =>
      Repository.post('user/favorites', { song_id }),
    deleteFavorite: (favoriteId: number):
      Promise<AxiosResponse> =>
      Repository.delete(`user/favorites/${favoriteId}`),
    reset: (data: UserReset):
      Promise<AxiosResponse> =>
      Repository.post('user/reset', data),
    confirmReset: (data: UserResetConfirm):
      Promise<AxiosResponse> =>
      Repository.post('user/reset/confirm', data),
    logout: ():
      Promise<AxiosResponse> =>
      Repository.post('user/logout'),
  },
}
