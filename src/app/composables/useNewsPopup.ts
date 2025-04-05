import { prefs } from '@app/utils/prefs.ts'
import { useNewsApi } from '@app/composables/api'
import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'

/**
 * useNewsPopup composable
 * Fetch the latest news and open news window
 */
export function useNewsPopup (): {
  openNewsIfUpdated: () => void
} {
  const { openWindow } = useWindows()
  const { getLastUpdated } = useNewsApi()

  /**
   * Checks for news updates and opens news window if new content exists
   * Compares stored last-read news ID with latest available news ID from API
   * Shows news window with 3-second delay if new content is available
   */
  const openNewsIfUpdated = (): void => {
    // Fetch latest news from API
    getLastUpdated().fetch().then(res => {
      // Retrieve user's last-read news ID from persistent storage and compare it
      const latestNewsRead = prefs.get<number>('latestNewsRead', 0)!
      if (latestNewsRead < res.data.id) {
        // Update persistent storage with new latest ID
        prefs.save('latestNewsRead', res.data.id)

        // Open news window after short delay to allow UI updates
        setTimeout(() => openWindow(Win.NEWS), 3000)
      }
    }).catch(() => {
      console.error('Failed to get news.');
    })
  }

  return { openNewsIfUpdated }
}
