import Repository from '@app/api/axios'
import type {
  UserLogin,
  UserEdit,
  UserRegister,
  UserReset,
  UserResetConfirm,
  ReactResponse,
  UserResponse,
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
