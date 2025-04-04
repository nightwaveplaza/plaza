import { ref } from 'vue'
import { type AlertWindowParams, type SongWindowParams, Win, type Window } from '@app/types'

const windows = ref(<Record<string, Window>>{})
const activeWindow = ref('')
const activeZIndex = ref(100)


/**
 * useWindows composable
 * Shared logic to manage opened windows
 * Uses windowStore as state manager
 */
export function useWindows () {
  /**
   * Open window and pass properties to it
   * @param name window name
   * @param params
   * @param winComponent
   */
  const openWindow = (name: string, params?: AlertWindowParams | SongWindowParams, winComponent?: string) => {
    if (name in windows.value) {
      restore(name)
    } else {
      const component = winComponent ?? 'window-' + name
      windows.value[name] = { params, name, component, isMinimized: false }
      pullUp(name)
    }
  }

  const pullUp = (name?: string) => {
    activeWindow.value = name ?? (Object.keys(windows.value).pop() ?? '')
    activeZIndex.value++
  }

  const closeWindow = (name: Win | string) => {
    if (name in windows.value) {
      delete windows.value[name]
    }

    pullUp()
  }

  const minimizeWindow = (name: string) => {
    if (name in windows.value) {
      windows.value[name]!!.isMinimized = true
    }
  }

  const restore = (name: string) => {
    if (name in windows.value) {
      windows.value[name]!!.isMinimized = false
      pullUp(name)
    }
  }

  const updateTitle = (name: string, title: string) => {
    if (name in windows.value) {
      windows.value[name]!!.title = title
    }
  }

  const toggleMinimize = (name: Win | string) => {
    if (name in windows.value) {
      if (windows.value[name]!.isMinimized) {
        restore(name)
      } else {
        if (activeWindow.value === name) {
          minimizeWindow(name)
        } else {
          pullUp(name)
        }
      }
    }
  }

  const winAlert = (text: string, title: string, type = 'warn') => {
    // Window name must be unique, generate random string for alerts
    const id = Math.random().toString(36).slice(2, 11)
    openWindow(`${Win.ALERT}-${id}`, { text, title, type, }, 'window-alert')
  }

  const winSongInfo = (id: string) => {
    openWindow(`${Win.SONG}-${id}`, { songId: id }, 'window-song')
  }

  return {
    openWindow,
    closeWindow,
    openedWindows: windows,
    activeWindow,
    minimizeWindow,
    toggleMinimize,
    winAlert,
    winSongInfo,
    updateTitle,
    pullUp,
    activeZIndex
  }
}
