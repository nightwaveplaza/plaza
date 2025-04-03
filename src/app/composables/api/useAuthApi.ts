import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'
import {
  type ResultResource,
  type UserLoginForm,
  type UserLoginResource,
  type UserResetConfirmForm,
  type UserResetForm
} from '@app/types'

export function useAuthApi (): {
  csrf: () => ApiHandler<ResultResource, []>;
  login: () => ApiHandler<UserLoginResource, [UserLoginForm]>;
  logout: () => ApiHandler<ResultResource, []>;
  resetPassword: () => ApiHandler<ResultResource, [UserResetForm]>;
  resetPasswordConfirm: () => ApiHandler<ResultResource, [UserResetConfirmForm]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    csrf: createApiHandler<ResultResource>('/auth/csrf-cookie', 'POST'),
    login: createApiHandler<UserLoginResource, [UserLoginForm]>('v2/auth/login', 'POST'),
    logout: createApiHandler<ResultResource>('v2/auth/logout', 'POST'),
    resetPassword: createApiHandler<ResultResource, [UserResetForm]>('v2/auth/reset-password', 'POST'),
    resetPasswordConfirm: createApiHandler<ResultResource, [UserResetConfirmForm]>('v2/auth/confirm-password', 'POST')
  }
}
