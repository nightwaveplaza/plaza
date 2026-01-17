import { ref } from 'vue'
import { type AlertWindowParams, type SongWindowParams, Win, type WindowState } from '@app/types'
import { registry } from '@app/utils/windowsConfig.ts'

const windows = ref(<Record<string, WindowState>>{})
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
   * @param win
   * @param id
   * @param params
   */
  const openWindow = (win: Win, id?: string, params?: AlertWindowParams | SongWindowParams): void => {
    const winId = id ?? win

    activeZIndex.value++

    if (winId in windows.value) {
      restore(winId)
    } else {
      windows.value[winId] = {
        ...registry[win],
        params,
        id: winId,
        isMinimized: false,
        zIndex: activeZIndex.value,
        component: 'window-' + win
      }
      activeWindow.value = winId
    }
  }

  const pullUp = (winId?: string) => {
    activeWindow.value = winId ?? (Object.keys(windows.value).pop() ?? '')
    activeZIndex.value++
    if (activeWindow.value in windows.value) {
      windows.value[activeWindow.value]!.zIndex = activeZIndex.value
    }
  }

  const closeWindow = (winId: string): void => {
    if (winId in windows.value) {
      delete windows.value[winId]
    }

    pullUp()
  }

  const minimizeWindow = (winId: string): void => {
    if (winId in windows.value) {
      windows.value[winId]!.isMinimized = true
    }
  }

  const restore = (winId: string): void => {
    if (winId in windows.value) {
      windows.value[winId]!.isMinimized = false
      pullUp(winId)
    }
  }

  const toggleMinimize = (winId: Win | string): void => {
    if (!(winId in windows.value)) {
      return
    }

    if (windows.value[winId]!.isMinimized) {
      restore(winId)
    } else {
      if (activeWindow.value === winId) {
        minimizeWindow(winId)
      } else {
        pullUp(winId)
      }
    }
  }

  const winAlert = (text: string, title: string, type = 'warn'): void => {
    // Window winId must be unique, generate random string for alerts
    const id = Math.random().toString(36).slice(2, 11)
    openWindow(Win.ALERT, id, { text, type })
    windows.value[id]!.title = title
  }

  const winSongInfo = (id: string): void => {
    openWindow(Win.SONG, id, { songId: id })
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
    pullUp,
    activeZIndex
  }
}
