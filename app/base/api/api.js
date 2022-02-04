import Repository from '@base/api/axios';

/**
 * Status
 */
export const status = {
  get: () => Repository.get('status'),
  getOsd: () => Repository.get('status/on-screen-data'),
};

/**
 * Backgrounds
 */
export const background = {
  get: () => Repository.get('backgrounds'),
  random: () => Repository.get('backgrounds/random'),
};

/**
 * Songs
 */
export const songs = {
  get: (id) => Repository.get(`songs/${id}`),
};

/**
 * Play history
 */
export const history = {
  get: (page) => Repository.get(`history/${page}`),
};

/**
 * Reactions
 */
export const reactions = {
  react: reaction => Repository.post('reactions', {reaction}),
};

/**
 * Ratings
 */
export const ratings = {
  get: (range, page) => Repository.get(`ratings/${range}/${page}`),
};

/**
 * News
 */
export const news = {
  get: (page) => Repository.get(`news/${page}`),
  latest: () => Repository.get(`news/latest`),
};

/**
 * User
 */
export const user = {
  get: () => Repository.get('user'),

  login(username, password) {
    const authStr = window.btoa(
        unescape(encodeURIComponent(username + ':' + password)));
    return Repository.post('user/login', {}, {
      headers: {
        Authorization: 'Basic ' + authStr,
      },
    });
  },

  register: (data) => Repository.post('user/register', data),
  edit: (data) => Repository.put('user', data),
  reset: (data) => Repository.post('user/reset', data),
  confirmReset: (data) => Repository.post('user/reset/confirm', data),
  logout: () => Repository.post('user/logout'),
  favorites: (page) => Repository.get(`user/favorites/${page}`),
  deleteFavorite: (favoriteId) => Repository.delete(
      `user/favorites/${favoriteId}`),
};

/**
 * Captcha
 */
export const captcha = {
  get: () => Repository.get('captcha'),
};

