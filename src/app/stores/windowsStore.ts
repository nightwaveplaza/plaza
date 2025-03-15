import { defineStore } from 'pinia'
import type { AlertWindowParams, SongWindowParams, Window } from '@app/types/types'
import { computed, ref } from 'vue'

interface WindowList {
  [key: string]: Window
}

/**
 * Windows store
 * Manages the global state of opened windows
 */
export const useWindowsStore = defineStore('windowsStore', () => {
  // All opened windows
  const windows = ref(<WindowList>{})

  // Current active window name and active z-index (CSS)
  const activeWindow = ref('')
  const activeZIndex = ref(100)

  // Returns all Alerts windows (name starts with alert-)
  const alerts = computed(() => Object.entries(windows.value).filter(([k]) => k.includes('alert-')))

  // Returns all song info windows (name starts with song-)
  const songWindows = computed(() => Object.entries(windows.value).filter(([k]) => k.includes('song-')))
  const isOpened = computed(() => (name: string) => windows.value.hasOwnProperty(name))

  /**
   * Open window and pass properties to it
   * @param name window name
   * @param params
   * @param winComponent
   */
  function open (name: string, params: AlertWindowParams | SongWindowParams | undefined = undefined, winComponent?: string) {
    // If not already open
    if (!windows.value.hasOwnProperty(name)) {
      let component = winComponent ?? 'window-' + name
      windows.value[name] = { params, name, component, isMinimized: false }
    }
    pullUp(name)
  }

  /**
   * Pull up the window and make it active
   * if not window name specified, make the latest opened window active
   * @param name window name
   */
  function pullUp (name?: string) {
    activeWindow.value = name ?? (Object.keys(windows.value).pop() ?? '')
    activeZIndex.value++
  }

  /**
   * Close window and pull up the latest window opened
   * @param name window
   */
  function close (name: string) {
    if (windows.value.hasOwnProperty(name)) {
      delete windows.value[name]
    }

    pullUp()
  }

  function minimize (name: string) {
    if (windows.value.hasOwnProperty(name)) {
      windows.value[name]!!.isMinimized = true
    }
  }

  function restore (name: string) {
    if (windows.value.hasOwnProperty(name)) {
      windows.value[name]!!.isMinimized = false
      pullUp(name)
    }
  }

  function updateTitle (name: string, title: string) {
    if (windows.value.hasOwnProperty(name)) {
      windows.value[name]!!.title = title
    }
  }

  return {
    windows, activeWindow, activeZIndex, open, close, pullUp,
    alerts, songWindows, minimize, restore, isOpened, updateTitle
  }
})
