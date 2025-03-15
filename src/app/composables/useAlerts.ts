import { useWindowsStore } from '@app/stores/windowsStore.ts'

export function useAlerts() {
  const windowsStore = useWindowsStore()

  const winAlert = (text: string, title: string, type = 'warn') => {
    const id = Math.random().toString(36).substr(2, 9)
    windowsStore.open('alert-' + id, { id, text, title, type, }, 'window-alert')
  }

  const winSongInfo = (id: string) => {
    windowsStore.open('song-' + id, { id }, 'window-song')
  }

  return { winAlert, winSongInfo }
}
