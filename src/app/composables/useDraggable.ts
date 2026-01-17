import { nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'

const SNAP_SIZE = 15

export function useDraggable (windowRef: Ref<HTMLElement | null>, winId: string): void {
  const { openedWindows, moveTo } = useWindows()

  let startMousePositionX = 0
  let startMousePositionY = 0
  let startWindowPositionX = 0
  let startWindowPositionY = 0
  let resizeDebounceTimeout: ReturnType<typeof setTimeout> | undefined = undefined
  const isDragging = ref(false)
  const isCentered = ref(false)
  const height = ref(0)

  /**
   * Start dragging
   * @param e
   */
  const handleDragStart = (e: MouseEvent): void => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'SPAN') {
      return
    }

    isDragging.value = true
    startMousePositionX = e.clientX
    startMousePositionY = e.clientY
    startWindowPositionX = openedWindows.value[winId]!.x
    startWindowPositionY = openedWindows.value[winId]!.y

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  /**
   * Moving window
   * @param e
   */
  const handleMouseMove = (e: MouseEvent): void => {
    if (!isDragging.value) {
      return
    }

    e.preventDefault()

    const mouseDeltaX = e.clientX - startMousePositionX
    const mouseDeltaY = e.clientY - startMousePositionY

    let nextX = startWindowPositionX + mouseDeltaX
    let nextY = startWindowPositionY + mouseDeltaY

    // Snap to left
    if (nextX < SNAP_SIZE) {
      nextX = 0
    }

    // Snap to top
    if (nextY < SNAP_SIZE) {
      nextY = 0
    }

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight
    const rect = windowRef.value!.getBoundingClientRect()
    // Snap to right
    if (nextX + windowRef.value!.offsetWidth > window.innerWidth - SNAP_SIZE) {
      nextX = viewportW - rect.width
    }

    // Snap to bottom
    if (nextY + windowRef.value!.offsetHeight > window.innerHeight - SNAP_SIZE) {
      nextY = viewportH - rect.height
    }

    moveTo(winId, nextX, nextY)
    isCentered.value = false
  }

  /**
   * Stop dragging
   */
  const handleMouseUp = (): void => {
    isDragging.value = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  /**
   * Handle window resize event (debounce checkBounds)
   */
  const handleWindowResize = (): void => {
    clearTimeout(resizeDebounceTimeout)
    resizeDebounceTimeout = setTimeout(() => {
      checkBounds()
    }, 100)
  }

  /**
   * Check bounds and return window if out of screen
   */
  function checkBounds (): void {
    if (!windowRef.value) {
      return
    }

    const rect = windowRef.value.getBoundingClientRect()
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    // If user didn't move the window, center it
    if (isCentered.value) {
      centerWindow()
    }

    let outOfBounds = false
    let nextX = openedWindows.value[winId]!.x
    let nextY = openedWindows.value[winId]!.y

    // Check left
    if (nextX < 0) {
      nextX = 0
      outOfBounds = true
    }

    // Check top
    if (nextY < 0) {
      nextY = 0
      outOfBounds = true
    }

    // Check right
    if (nextX + rect.width > viewportW) {
      nextX = Math.max(0, viewportW - rect.width)
      outOfBounds = true
    }

    // Check bottom
    if (nextY + rect.height > viewportH) {
      nextY = Math.max(0, viewportH - rect.height)
      outOfBounds = true
    }

    if (outOfBounds) {
      moveTo(winId, nextX, nextY)
    }
  }

  const centerWindow = (): void => {
    nextTick().then(() => {
      if (windowRef.value) {
        const el = windowRef.value

        // Target window size
        const winWidth = el.offsetWidth
        const winHeight = el.offsetHeight

        // Viewport size
        const viewportW = window.innerWidth
        const viewportH = window.innerHeight

        const nextX = (viewportW / 2) - (winWidth / 2)
        const nextY = (viewportH / 2) - (winHeight / 2)

        moveTo(winId, nextX, nextY)
        isCentered.value = true
      }
    })
  }

  onBeforeMount(() => {
    centerWindow()
  })

  // let resizeObserver: ResizeObserver | null = null
  onMounted(() => {
    if (!windowRef.value) {
      return
    }

    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('orientationchange', handleWindowResize)

    // Create observer
    //resizeObserver = new ResizeObserver(() => {
    //handleWindowResize()
    //})
    //resizeObserver.observe(windowRef.value)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('resize', handleWindowResize)
    window.removeEventListener('orientationchange', handleWindowResize)

    //if (resizeObserver) {
    //  resizeObserver.disconnect()
    //}
  })

  return { height, centerWindow, handleDragStart }
}
