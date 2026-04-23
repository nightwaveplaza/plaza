import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'
import { useLocalStorage } from '@vueuse/core'
import { useApi } from '@app/composables/useApi.ts'
import { newsApi } from '@app/api/news.api.ts'

/**
 * useNewsPopup composable
 * Fetch the latest news and open news window
 */
const latestNewsRead = useLocalStorage<number>('latestNewsRead', 0)

export function useNewsPopup () {
  const { openWindow } = useWindows()
  const { execute: getLastUpdated } = useApi(newsApi.getLastUpdated)

  /**
   * Checks for news updates and opens news window if new content exists
   * Compares stored last-read news ID with latest available news ID from API
   * Shows news window with 3-second delay if new content is available
   */
  const openNewsIfUpdated = async (): Promise<void> => {
    try {
      const res = await getLastUpdated()
      const fetchedNewsId = res.data.id

      if (latestNewsRead.value < fetchedNewsId) {
        latestNewsRead.value = fetchedNewsId

        setTimeout(() => openWindow(Win.NEWS), 3000)
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    }
  }

  return { openNewsIfUpdated }
}
