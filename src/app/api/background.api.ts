import type { BackgroundCollection, BackgroundResponse } from '@app/types';
import api from '@app/api/index.ts';

// prettier-ignore
export const backgroundApi = {
  getBackgrounds: () =>
    api.get<BackgroundCollection>('v2/backgrounds'),
  getRandomBackground: () =>
    api.get<BackgroundResponse>('v2/backgrounds/random'),
};
