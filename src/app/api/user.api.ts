import api from '@app/api/index.ts';
import type {
  ResultResource,
  User,
  UserPasswordForm,
  UserProfileForm,
  UserRegisterForm,
  UserResource,
  UserStatsResource,
} from '@app/types';

// prettier-ignore
export const userApi = {
  getUser: () =>
    api.get<UserResource>('v2/users/me'),
  getUserStats: () =>
    api.get<UserStatsResource>('v2/users/me/stats'),
  registerUser: (data: UserRegisterForm) =>
    api.post<User>('v2/users', data),
  updatePassword: (data: UserPasswordForm) =>
    api.put<ResultResource>('v2/users/me/password', data),
  updateProfile: (data: UserProfileForm) =>
    api.put<UserResource>('v2/users/me', data),
  deleteProfile: (data: { current_password: string }) =>
    api.delete('v2/users/me', { data }),
};
