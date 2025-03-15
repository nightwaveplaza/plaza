import type { WinType } from '@app/types/types.ts'
import { useWindowsStore } from '@app/stores/windowsStore.ts'
import { computed } from 'vue'

export function useWindows() {
  const windowsStore = useWindowsStore()

  const openedWindows = computed(() => windowsStore.windows)

  const openWindow = (name: WinType) => {
    windowsStore.open(name)
  }

  const closeWindow = (name: WinType) => {
    windowsStore.close(name)
  }

  const minimizeWindow = (name: WinType) => {
    windowsStore.minimize(name)
  }

  return { openWindow, closeWindow, openedWindows, minimizeWindow }
}
