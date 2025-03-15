import type { WinType } from '@app/types/types.ts'
import { useWindowsStore } from '@app/stores/windowsStore.ts'
import { computed } from 'vue'

export function useWindows() {
  const windowsStore = useWindowsStore()

  const openWindow = (name: WinType) => {
    windowsStore.open(name)
  }

  const closeWindow = (name: WinType) => {
    windowsStore.close(name)
  }

  const openedWindows = computed(() => windowsStore.windows)

  return { openWindow, closeWindow, openedWindows }
}
