import { defineStore } from 'pinia'
import type { Window } from '@common/js/types'

interface State {
  windows: Window[],
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
      return (windowName: string) => state.windows.some(w => w.name === windowName)
    },

    isMinimized: (state) => {
      return (windowName: string): boolean => state.minimized.indexOf(windowName) >= 0
    },

    alerts: (state) => state.windows.filter(w => w.name.includes('alert-')),

    songWindows: (state) => state.windows.filter(w => w.name.includes('song-')),
  },

  actions: {
    open (name: string, props: object = {}) {
      if (!this.isOpened(name)) {
        this.windows.push({ ...props, name, form: 'window-' + name })
      }
      this.pullUp(name)
    },

    pullUp (name?: string) {
      this.activeZIndex++
      this.activeWindow = name ?? this.windows[this.windows.length - 1].name
    },

    close (name: string) {
      this.windows = this.windows.filter(w => w.name !== name)

      if (this.windows.length > 0) {
        this.pullUp()
      }
    },

    minimize (name: string) {
      if (!this.isMinimized(name)) {
        this.minimized.push(name)
      }
    },

    restore (name: string) {
      this.minimized = this.minimized.filter(n => n !== name)
      this.pullUp(name)
    },

    updateTitle (name: string, title: string) {
      if (this.isOpened(name)) {
        const index: number = this.windows.map(e => e.name).indexOf(name)
        this.windows[index].title = title
      }
    },

    alert (text: string, title: string, type: string = 'warn') {
      const id = Math.random().toString(36).substr(2, 9)
      this.open('alert-' + id, {
        id, text, title, type,
      })
    },

    showSong (id: string) {
      this.open('song-' + id, {
        id,
      })
    },
  },
})
