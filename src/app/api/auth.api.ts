import api from '@app/api/index.ts'
import {
  type ResultResource,
  type UserLoginForm,
  type UserLoginResource,
  type UserResetConfirmForm,
  type UserResetForm
} from '@app/types'

export const authApi = {
  csrf: () => api.post<ResultResource>('/auth/csrf-cookie').then(res => res.data),
  login: (data: UserLoginForm) => api.post<UserLoginResource>('v2/auth/login', data).then(res => res.data),
  token: (data: UserLoginForm) => api.post<UserLoginResource>('v2/auth/token', data).then(res => res.data),
  logout: () => api.post<ResultResource>('v2/auth/logout').then(res => res.data),
  resetPassword: (data: UserResetForm) => api.post<ResultResource>('v2/auth/reset-password', data).then(res => res.data),
  resetPasswordConfirm: (data: UserResetConfirmForm) => api.post<ResultResource>('v2/auth/confirm-password', data).then(res => res.data)
}