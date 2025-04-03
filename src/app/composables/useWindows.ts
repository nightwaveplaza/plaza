import { useWindowsStore } from '@app/stores/windowsStore.ts'
import { computed } from 'vue'
import { Win } from '@app/types'

/**
 * useWindows composable
 * Shared logic to manage opened windows
 * Uses windowStore as state manager
 */
export function useWindows () {
  const windowsStore = useWindowsStore()

  const openedWindows = computed(() => windowsStore.windows)
  const activeWindow = computed(() => windowsStore.activeWindow)

  const openWindow = (name: Win | string) => {
    windowsStore.open(name)
  }

  const closeWindow = (name: Win | string) => {
    windowsStore.close(name)
  }

  const minimizeWindow = (name: Win) => {
    windowsStore.minimize(name)
  }

  const toggleMinimize = (name: Win | string) => {
    if (windowsStore.windows.hasOwnProperty(name)) {
      if (windowsStore.windows[name]!!.isMinimized) {
        windowsStore.restore(name)
      } else {
        if (windowsStore.activeWindow === name) {
          windowsStore.minimize(name)
        } else {
          windowsStore.pullUp(name)
        }
      }
    }
  }

  const winAlert = (text: string, title: string, type = 'warn') => {
    // Window name must be unique, generate random string for alerts
    const id = Math.random().toString(36).slice(2, 11)
    windowsStore.open(`${Win.ALERT}-${id}`, { text, title, type, }, 'window-alert')
  }

  const winSongInfo = (id: string) => {
    windowsStore.open(`${Win.SONG}-${id}`, { songId: id }, 'window-song')
  }

  return {
    openWindow,
    closeWindow,
    openedWindows,
    minimizeWindow,
    toggleMinimize,
    activeWindow,
    winAlert,
    winSongInfo
  }
}
