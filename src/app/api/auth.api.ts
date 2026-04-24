import api from '@app/api/index.ts';
import {
  type ResultResource,
  type UserLoginForm,
  type UserLoginResource,
  type UserResetConfirmForm,
  type UserResetForm,
} from '@app/types';

// prettier-ignore
export const authApi = {
  login: (data: UserLoginForm) =>
    api.post<UserLoginResource>('v2/auth/login', data),
  token: (data: UserLoginForm) =>
    api.post<UserLoginResource>('v2/auth/token', data),
  logout: () =>
    api.post<ResultResource>('v2/auth/logout'),
  resetPassword: (data: UserResetForm) =>
    api.post<ResultResource>('v2/auth/reset-password', data),
  resetPasswordConfirm: (data: UserResetConfirmForm) =>
    api.post<ResultResource>('v2/auth/confirm-password', data),
};
