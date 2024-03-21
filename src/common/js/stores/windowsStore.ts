import { defineStore } from 'pinia'
import type { IfcWindow } from '@common/js/types'

interface State {
  windows: IfcWindow[],
  minimized: string[],
  activeWindow: string,
  activeZIndex: number
}

export const useWindowsStore = defineStore('windowsStore', {
  state: (): State => ({
    windows: [],
    minimized: [],
    activeWindow: '',
    activeZIndex: 100,
  }),

  getters: {
    isOpened: (state) => {
      return (windowName) => state.windows.some(w => w.name === windowName)
    },

    isMinimized: (state) => {
      return (windowName): boolean => state.minimized.indexOf(windowName) >= 0
    },

    alerts: (state) => state.windows.filter(w => w.name.includes('alert-')),

    songWindows: (state) => state.windows.filter(w => w.name.includes('song-')),
  },

  actions: {
    open (name: string) {
      if (this.isOpened(name)) {
        this.pullUp(name)
      } else {
        this.windows.push({ name, form: 'window-' + name })
      }
    },

    pullUp (name?: string) {
      this.activeWindow = name ?? this.windows[this.windows.length - 1].name
      this.activeZIndex++
    },

    close (name: string) {
      this.windows = this.windows.filter(w => w.name !== name)

      if (this.windows.length > 0) {
        this.pullUp()
      }
    },

    minimize (name) {
      if (!this.isMinimized(name)) {
        this.minimized.push(name)
      }
    },

    restore (name) {
      if (this.isMinimized(name)) {
        this.minimized = this.minimized.filter(n => n !== name)
        this.pullUp(name)
      }
    },

    updateTitle (name, title) {
      if (this.isOpened(name)) {
        const index: number = this.windows.map(e => e.name).indexOf(name)
        this.windows[index].title = title
      }
    },
  },
})
