import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const SNAP_SIZE = 15

export function useDraggable(targetRef: Ref<HTMLElement | null>) {
  const x = ref(0)
  const y = ref(0)

  let startMousePositionX = 0
  let startMousePositionY = 0
  let startWindowPositionX = 0
  let startWindowPositionY = 0
  let resizeDebounceTimeout: ReturnType<typeof setTimeout>|undefined = undefined
  const isDragging = ref(false)
  const isCentered = ref(false)

  let resizeObserver: ResizeObserver | null = null

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
    startWindowPositionX = x.value
    startWindowPositionY = y.value

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  /**
   * Moving window
   * @param e
   */
  const handleMouseMove = (e: MouseEvent): void => {
    if (!isDragging.value) return
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
    const rect = targetRef.value!.getBoundingClientRect()
    // Snap to right
    if (nextX + targetRef.value!.offsetWidth > window.innerWidth - SNAP_SIZE) {
      nextX = viewportW - rect.width
    }

    // Snap to bottom
    if (nextY + targetRef.value!.offsetHeight > window.innerHeight - SNAP_SIZE) {
      nextY = viewportH - rect.height
    }

    x.value = nextX
    y.value = nextY
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
  function checkBounds() {
    if (!targetRef.value) return

    // If user didn't move the window, center it
    if (isCentered.value) {
      centerWindow()
    }

    const rect = targetRef.value.getBoundingClientRect()

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    // Check left
    if (x.value < 0) {
      x.value = 0
    }

    // Check top
    if (y.value < 0) {
      y.value = 0
    }

    // Check right
    if (x.value + rect.width > viewportW) {
      x.value = Math.max(0, viewportW - rect.width)
    }

    // Check bottom
    if (y.value + rect.height > viewportH) {
      y.value = Math.max(0, viewportH - rect.height)
    }
  }

  const centerWindow = (): void => {
    nextTick().then(() => {
      if (targetRef.value) {
        const el = targetRef.value

        // Target window size
        const winWidth = el.offsetWidth
        const winHeight = el.offsetHeight

        // Viewport size
        const viewportW = window.innerWidth
        const viewportH = window.innerHeight

        x.value = (viewportW / 2) - (winWidth / 2)
        y.value = (viewportH / 2) - (winHeight / 2)

        isCentered.value = true
      }
    })
  }

  onMounted(() => {
    if (!targetRef.value) return

    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('orientationchange', handleWindowResize)

    // Create observer
    resizeObserver = new ResizeObserver(() => {
      handleWindowResize()
    })
    resizeObserver.observe(targetRef.value)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('resize', handleWindowResize)
    window.removeEventListener('orientationchange', handleWindowResize)

    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {x, y, centerWindow, handleDragStart }
}
