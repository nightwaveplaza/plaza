import {
  type ResultResource,
  type User,
  type UserPasswordForm, type UserProfileForm,
  type UserRegisterForm,
  type UserResource, type UserStatsResource
} from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useUserApi (): {
  getUser: () => ApiHandler<UserResource>;
  getUserStats: () => ApiHandler<UserStatsResource>;
  registerUser: () => ApiHandler<User, [UserRegisterForm]>;
  updatePassword: () => ApiHandler<ResultResource, [UserPasswordForm]>;
  updateProfile: () => ApiHandler<UserResource, [UserProfileForm]>;
  deleteProfile: () => ApiHandler<{}, [{current_password: string}]>;
} {
  const { createApiHandler } = useApiFactory()

  return {
    getUser: createApiHandler<UserResource>('v2/users/me'),
    getUserStats: createApiHandler<UserStatsResource>('v2/users/me/stats'),
    registerUser: createApiHandler<User, [UserRegisterForm]>('v2/users', 'POST'),
    updatePassword: createApiHandler<ResultResource, [UserPasswordForm]>('v2/users/me/password', 'PUT'),
    updateProfile: createApiHandler<UserResource, [UserProfileForm]>('v2/users/me', 'PUT'),
    deleteProfile: createApiHandler<{}, [{ current_password: string }]>('v2/users/me', 'DELETE')
  }
}
