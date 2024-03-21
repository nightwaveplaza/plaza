import Repository from '@common/js/api/axios'

export interface ifcUserAuth {
  username: string,
  password: string
}

export interface ifcUserRegister {
  username: string,
  email: string,
  password: string,
  captcha_response: string
}

export interface ifcUserEdit {
  current_password: string,
  password: string
}

export interface ifcUserReset {
  email: string,
  captcha_response: string
}

export interface ifcUserResetConfirm {
  token: string,
  password: string
}

/**
 * Status
 */
export const status = {
  get: () => Repository.get('status'),
  getOsd: () => Repository.get('status/on-screen-data'),
}

/**
 * Backgrounds
 */
export const background = {
  get: () => Repository.get('backgrounds'),
  random: () => Repository.get('backgrounds/random'),
}

/**
 * Songs
 */
export const songs = {
  get: (id: string) => Repository.get(`songs/${id}`),
}

/**
 * Play history
 */
export const history = {
  get: (page: number) => Repository.get(`history/${page}`),
}

/**
 * Reactions
 */
export const reactions = {
  react: (reaction: number) => Repository.post('reactions', { reaction }),
}

/**
 * Ratings
 */
export const ratings = {
  get: (range: string, page: number) => Repository.get(
    `ratings/${range}/${page}`),
}

/**
 * News
 */
export const news = {
  get: (page: number) => Repository.get(`news/${page}`),
  latest: () => Repository.get(`news/latest`),
}

/**
 * User
 */
export const user = {
  get: () => Repository.get('user'),
  auth: (data: ifcUserAuth) => Repository.post('user/auth', data),
  register: (data: ifcUserRegister) => Repository.post('user/register', data),
  edit: (data: ifcUserEdit) => Repository.put('user', data),
  reset: (data: ifcUserReset) => Repository.post('user/reset', data),
  confirmReset: (data: ifcUserResetConfirm) => Repository.post('user/reset/confirm', data),
  logout: () => Repository.post('user/logout'),
  favorites: (page: number) => Repository.get(`user/favorites/${page}`),
  deleteFavorite: (favoriteId: string) => Repository.delete(`user/favorites/${favoriteId}`),
  addFavorite: (song_id: string) => Repository.post('user/favorites', { song_id }),
}

/**
 * Captcha
 */
export const captcha = {
  get: () => Repository.get('captcha'),
}

