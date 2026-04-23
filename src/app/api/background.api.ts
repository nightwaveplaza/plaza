import type { BackgroundCollection, BackgroundResponse } from '@app/types'
import api from '@app/api/index.ts'

export const backgroundApi = {
  getBackgrounds: () => api.get<BackgroundCollection>('v2/backgrounds').then(res => res.data),
  getRandomBackground: () => api.get<BackgroundResponse>('v2/backgrounds/random').then(res => res.data),
}