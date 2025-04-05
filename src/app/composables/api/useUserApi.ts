import {
  type ResultResource,
  type User,
  type UserEmailForm,
  type UserPasswordForm,
  type UserRegisterForm,
  type UserResource
} from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useUserApi (): {
  getUser: () => ApiHandler<UserResource>;
  registerUser: () => ApiHandler<User, [UserRegisterForm]>;
  updatePassword: () => ApiHandler<ResultResource, [UserPasswordForm]>;
  updateEmail: () => ApiHandler<ResultResource, [UserEmailForm]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getUser: createApiHandler<UserResource>('v2/users/me'),
    registerUser: createApiHandler<User, [UserRegisterForm]>('v2/users', 'POST'),
    updatePassword: createApiHandler<ResultResource, [UserPasswordForm]>('v2/users/me/password', 'PUT'),
    updateEmail: createApiHandler<ResultResource, [UserEmailForm]>('v2/users/me/email', 'PUT')
  }
}
