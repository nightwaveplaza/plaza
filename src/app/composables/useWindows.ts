import { useWindowsStore } from '@app/stores/windowsStore.ts'
import { computed } from 'vue'

export enum WinType {
  ABOUT = 'about',
  ALERT = 'alert',
  CREDITS = 'credits',
  HISTORY = 'history',
  LOADING = 'loading',
  MOBILE = 'mobile',
  NEWS = 'news',
  PLAYER = 'player',
  PLAYER_TIMER = 'player-timer',
  RATINGS = 'ratings',
  SETTINGS = 'settings',
  SETTINGS_LANGUAGE = 'settings-language',
  SONG = 'song',
  SUPPORT = 'support',
  USER = 'user',
  USER_EMAIL = 'user-email',
  USER_FAVORITES = 'user-favorites',
  USER_LOGIN = 'user-login',
  USER_PASSWORD = 'user-password',
  USER_REGISTER = 'user-register',
  USER_RESET = 'user-reset',
  USER_RESET_PASSWORD = 'user-reset-password'
}

/**
 * useWindows composable
 * Shared logic to manage opened windows
 * Uses windowStore as state manager
 */
export function useWindows () {
  const windowsStore = useWindowsStore()

  const openedWindows = computed(() => windowsStore.windows)
  const activeWindow = computed(() => windowsStore.activeWindow)

  const openWindow = (name: WinType | string) => {
    windowsStore.open(name)
  }

  const closeWindow = (name: WinType | string) => {
    windowsStore.close(name)
  }

  const minimizeWindow = (name: WinType) => {
    windowsStore.minimize(name)
  }

  const toggleMinimize = (name: WinType | string) => {
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
    windowsStore.open(`${WinType.ALERT}-${id}`, { text, title, type, }, 'window-alert')
  }

  const winSongInfo = (id: string) => {
    windowsStore.open(`${WinType.SONG}-${id}`, { songId: id }, 'window-song')
  }

  return {
    openWindow,
    closeWindow,
    openedWindows,
    minimizeWindow,
    toggleMinimize,
    activeWindow,
    winAlert,
    winSongInfo,
    WinType
  }
}
