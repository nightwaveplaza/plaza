import { nextTick, onMounted, ref, type Ref } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useEventListener } from '@vueuse/core'
import { isMobile } from '@app/utils/helpers.ts'

// Snap threshold depends on pointer precision (touch vs mouse)
const SNAP_SIZE = isMobile() ? 5 : 15
const DOUBLE_CLICK_DELAY = 300

export function useDraggableWindow (
  windowRef: Ref<HTMLElement | null>,
  winId: string
){
  const { openedWindows, moveTo } = useWindows()

  // State
  const isDragging = ref(false)
  const isCentered = ref(true)

  // Drag calculations
  let startX = 0,
    startY = 0,
    winStartX = 0,
    winStartY = 0,
    lastPointerDownTime = 0

  // Window positioning
  const centerWindow = (): void => {
    if (!windowRef.value) return

    const el = windowRef.value
    const viewportW = window.innerWidth
    const viewportH = window.visualViewport ? window.visualViewport.height : window.innerHeight

    const nextX = (viewportW / 2) - (el.offsetWidth / 2)
    const nextY = (viewportH / 2) - (el.offsetHeight / 2)

    moveTo(winId, Math.max(0, nextX), Math.max(0, nextY))
    isCentered.value = true
  }

  const clampToBounds = (): void => {
    if (!windowRef.value) return

    const winState = openedWindows.value[winId]
    if (!winState) return

    const viewportW = window.innerWidth
    const viewportH = window.visualViewport ? window.visualViewport.height : window.innerHeight
    const rect = windowRef.value.getBoundingClientRect()

    let nextX = winState.x
    let nextY = winState.y

    // Prevent window from getting lost outside viewport bounds
    if (nextX + rect.width > viewportW) nextX = Math.max(0, viewportW - rect.width)
    if (nextY + rect.height > viewportH) nextY = Math.max(0, viewportH - rect.height)
    if (nextX < 0) nextX = 0
    if (nextY < 0) nextY = 0

    if (nextX !== winState.x || nextY !== winState.y) {
      moveTo(winId, nextX, nextY)
    }
  }

  // Drag gestures
  const handleDragStart = (e: PointerEvent): void => {
    const target = e.target as HTMLElement
    // Ignore interactive elements in the header
    if (target.tagName === 'BUTTON' || target.tagName === 'SPAN') return

    const winState = openedWindows.value[winId]
    if (!winState) return

    // Double-tap/click detection
    const currentTime = Date.now()
    if (currentTime - lastPointerDownTime < DOUBLE_CLICK_DELAY) {
      centerWindow()
      lastPointerDownTime = 0
      return
    }
    lastPointerDownTime = currentTime

    isDragging.value = true

    startX = e.clientX
    startY = e.clientY
    winStartX = winState.x
    winStartY = winState.y

    try {
      // Prevents pointer loss if cursor moves outside the browser/webview
      target.setPointerCapture(e.pointerId)
    } catch {
      console.log("Failed catch pointer")
    }
  }

  const handlePointerMove = (e: PointerEvent): void => {
    if (!isDragging.value || !windowRef.value) return
    e.preventDefault()

    let nextX = winStartX + (e.clientX - startX)
    let nextY = winStartY + (e.clientY - startY)

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight
    const rect = windowRef.value.getBoundingClientRect()

    // Magnetic snapping to screen edges
    if (nextX < SNAP_SIZE) nextX = 0
    else if (nextX + rect.width > viewportW - SNAP_SIZE) nextX = viewportW - rect.width

    if (nextY < SNAP_SIZE) nextY = 0
    else if (nextY + rect.height > viewportH - SNAP_SIZE) nextY = viewportH - rect.height

    moveTo(winId, nextX, nextY)
    isCentered.value = false
  }

  const stopDrag = (e: PointerEvent): void => {
    if (!isDragging.value) return
    isDragging.value = false

    const target = e.target as HTMLElement
    try {
      if (target.hasPointerCapture && target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId)
      }
    } catch {
      console.log("Failed to release pointer")
    }
  }

  useEventListener(window, 'pointermove', handlePointerMove, { passive: false })
  useEventListener(window, 'pointerup', stopDrag)
  useEventListener(window, 'pointercancel', stopDrag)

  // Viewport Adjustments
  let lastW = window.innerWidth
  let lastH = window.visualViewport ? window.visualViewport.height : window.innerHeight
  let resizeTimeout: ReturnType<typeof setTimeout>

  const handleResize = (): void => {
    clearTimeout(resizeTimeout)

    // Debounce to wait for Android orientation animation to finish
    resizeTimeout = setTimeout(() => {
      const currentW = window.innerWidth
      const currentH = window.visualViewport?.height ?? window.innerHeight

      const isOrientationChange = currentW !== lastW
      // Ignore vertical layout jumps caused by virtual keyboards
      const isKeyboardToggle = !isOrientationChange && Math.abs(currentH - lastH) > 250

      if (!isKeyboardToggle) {
        if (isCentered.value) {
          centerWindow()
        } else {
          clampToBounds()
        }
      }

      lastW = currentW
      lastH = currentH
    }, 150)
  }

  useEventListener(window, 'resize', handleResize)
  if (window.visualViewport) {
    useEventListener(window.visualViewport, 'resize', handleResize)
  }

  onMounted(async () => {
    await nextTick()
    centerWindow()
  })

  return { isCentered, handleDragStart }
}
