import type { BackgroundResponse, BackgroundCollection } from '@app/types'
import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useBackgroundsApi (): {
  getBackgrounds: () => ApiHandler<BackgroundCollection>;
  getRandomBackground: () => ApiHandler<BackgroundResponse>
} {
  const { createApiHandler } = useApiFactory()

  return {
    getBackgrounds: createApiHandler<BackgroundCollection>('v2/backgrounds'),
    getRandomBackground: createApiHandler<BackgroundResponse>('v2/backgrounds/random')
  }
}
