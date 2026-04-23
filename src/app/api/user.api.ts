import api from '@app/api/index.ts'
import type {
  ResultResource,
  User,
  UserPasswordForm,
  UserProfileForm,
  UserRegisterForm,
  UserResource,
  UserStatsResource,
} from '@app/types'

export const userApi = {
  getUser: () => api.get<UserResource>('v2/users/me').then(res => res.data),
  getUserStats: () => api.get<UserStatsResource>('v2/users/me/stats').then(res => res.data),

  registerUser: (data: UserRegisterForm) => api.post<User>('v2/users', data).then(res => res.data),
  updatePassword: (data: UserPasswordForm) => api.put<ResultResource>('v2/users/me/password', data).then(res => res.data),
  updateProfile: (data: UserProfileForm) => api.put<UserResource>('v2/users/me', data).then(res => res.data),
  deleteProfile: (data: { current_password: string}) => api.delete('v2/users/me', { data }).then(res => res.data),
}