<template>
  <div v-show="!windowState.isMinimized"
       ref="windowRef"
      :id="'window-' + id"
      class="win-window"
      :style="style"
      :class="{'window-alert': windowState.isAlert}"
      @mousedown="pullUp"
  >
    <div class="inner" :class="{'d-flex flex-column h-100': windowState.height}">
      <div class="header header-draggable noselect"
           :class="{inactive: !isActive}"
           @dblclick="centerWindow"
           @mousedown="handleDragStart"
      >
        <div class="icon" />
        {{ windowTitle }}
        <div v-if="windowState.headerButtons?.length !== 0" class="buttons">
          <win-button v-if="showMinimizeButton" class="button-minimize" @click="minimize">
            <span />
          </win-button>
          <win-button v-if="showMaximizeButton" class="button-maximize" @click="toggleFullScreen">
            <span />
          </win-button>
          <win-button v-if="showCloseButton" class="button-close" @click="close">
            <span />
          </win-button>
        </div>
      </div>

      <component :is="props.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  type CSSProperties,
  onBeforeMount,
  onMounted,
  onUnmounted,
  provide,
  type Ref,
  ref,
  toRef
} from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useDraggable } from '@app/composables/useDraggable.ts'
import { useI18n } from 'vue-i18n'
import { WindowHeaderButtons, type WindowState } from '@app/types'

import { useFullscreen } from '@app/composables/useFullscreen.ts'

const emit = defineEmits(['closed'])
const { openedWindows, activeWindow, pullUp: pullUpWindow, minimizeWindow, closeWindow } = useWindows()
const { isFullscreenEnabled, requestFullscreen } = useFullscreen()

const { t } = useI18n()

const props = defineProps<{
  id: string,
  component: string
}>()

provide('windowId', toRef(props, 'id'))

const windowState: Ref<WindowState> = computed(() => {
  return openedWindows.value[props.id]!
})

const style = computed<CSSProperties>(() => ({
  zIndex: windowState.value.zIndex,
  position: 'absolute',
  left: `${windowState.value.x}px`,
  top: `${windowState.value.y}px`,
  transform: '',
  width: `${windowState.value.width}px`,
  maxWidth: windowState.value.width > 0 && windowState.value.width <= 320 ? `${windowState.value.width}px` : 'none',
  maxHeight: windowState.value.height ? `${windowState.value.height}px`: 'none',
  height: windowState.value.height ? `${actualHeight.value}px`: 'auto'
}))

const windowRef = ref<HTMLDivElement | null>(null)
const { centerWindow, handleDragStart } = useDraggable(windowRef, props.id)

const isActive = computed(() => activeWindow.value === props.id)
const actualHeight = ref(windowState.value.height ?? 0)

const windowTitle = computed(() => {
  const { title, titleKey } = windowState.value
  return title ? title : (titleKey ? t(titleKey) : ' ')
})

const showMinimizeButton = computed(() => {
  return windowState.value.headerButtons === undefined ||
      (windowState.value.headerButtons?.includes(WindowHeaderButtons.BTN_MINIMIZE))
})

const showMaximizeButton = computed(() => {
  return windowState.value.headerButtons?.includes(WindowHeaderButtons.BTN_MAXIMIZE) &&
      isFullscreenEnabled
})

const showCloseButton = computed(() => {
  return windowState.value.headerButtons === undefined ||
      (windowState.value.headerButtons?.includes(WindowHeaderButtons.BTN_CLOSE))
})

function toggleFullScreen(): void {
  requestFullscreen()
}

function pullUp (): void {
  pullUpWindow(props.id)
}

function minimize (): void {
  minimizeWindow(props.id)
}

function close (): void {
  emit('closed')
  closeWindow(props.id)
}

function calculateHeight(): void {
  if (!windowState.value.height) {
    return
  }

  const viewportHeight = window.innerHeight
  const availableSpace = viewportHeight - 28 - 30 // taskbar height and paddings
  const maxAllowedHeight = Math.max(40, availableSpace)

  actualHeight.value = Math.min(windowState.value.height, maxAllowedHeight)
}

onBeforeMount(() => {
  recenter()
})

function recenter(): void {
  calculateHeight()
  centerWindow()
}

onMounted(() => {
  window.addEventListener('resize', recenter)
  window.addEventListener('orientationchange', recenter)
})

onUnmounted(() => {
  window.removeEventListener('resize', recenter)
  window.removeEventListener('orientationchange', recenter)
})

defineExpose({
  close, pullUp
})
</script>
