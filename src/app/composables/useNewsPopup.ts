import { usePrefs } from '@app/composables/usePrefs.ts'
import { useNewsApi } from '@app/composables/api/useNewsApi.ts'
import { useWindows } from '@app/composables/useWindows.ts'

export function useNewsPopup () {
  const { openWindow, WinType } = useWindows()
  const { getLastUpdated } = useNewsApi()

  const openNewsIfUpdated = () => {
    getLastUpdated().fetch().then(res => {
      const latestNewsRead = usePrefs.get<number>('latestNewsRead', 0)!
      if (latestNewsRead < res.id) {
        usePrefs.save('latestNewsRead', res.id)
        setTimeout(() => openWindow(WinType.NEWS), 3000)
      }
    })
  }

  return { openNewsIfUpdated }
}
