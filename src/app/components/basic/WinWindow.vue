<template>
  <div ref="windowRef" class="win-window"
       :style="style" @mousedown="pullUp" v-show="!isMinimized" :id="'window-' + name" :class="{alert: props.isAlert}">
    <div class="inner" :class="{'d-flex flex-column h-100': height}">
      <div class="header header-draggable noselect" :class="{inactive: !isActive}"
           @dblclick="centerWindow" @mousedown="handleDragStart"
      >
        <div class="icon" />
        {{ title }}
        <slot name="header">
          <div class="buttons">
            <win-button class="button-minimize" @click="minimize">
              <span />
            </win-button>
            <win-button class="button-close" @click="close">
              <span />
            </win-button>
          </div>
        </slot>
      </div>

      <div :class="{'flex-grow-1': height}">
        <slot :close="close" />
      </div>

      <div class="win-window__statusbar noselect">
        <slot name="statusbar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useDraggable } from '@app/composables/useDraggable.ts'

const emit = defineEmits(['closed'])
const { openedWindows, activeWindow, activeZIndex, pullUp: pullUpWindow, minimizeWindow, closeWindow, updateTitle } = useWindows()


const props = withDefaults(defineProps<{
  title?: string,
  name: string,
  isAlert?: boolean,
  width?: number,
  height?: number | null
}>(), {
  title: ' ',
  width: 500,
  height: null,
})

const style = computed<CSSProperties>(() => ({
  zIndex: zIndex.value,
  position: 'absolute',
  left: `${x.value}px`,
  top: `${y.value}px`,
  transform: '',
  width: `${props.width}px`,
  maxWidth: props.width > 0 && props.width <= 320 ? `${props.width}px` : 'none',
  maxHeight: props.height ? `${props.height}px`: 'none',
  height: props.height ? `${actualHeight.value}px`: 'auto',
}))

const isMinimized = computed(() => openedWindows.value[props.name]?.isMinimized)
const isActive = computed(() => activeWindow.value === props.name)
const windowRef = ref<HTMLDivElement | null>(null)
const zIndex = ref(100)
const { centerWindow, handleDragStart, x, y } = useDraggable(windowRef)
const actualHeight = ref(props.height ?? 0)

function pullUp (): void {
  pullUpWindow(props.name)
  zIndex.value = activeZIndex.value
}

function minimize (): void {
  minimizeWindow(props.name)
}

function close (): void {
  emit('closed')
  closeWindow(props.name)
}

function calculateHeight() {
  if (!props.height) {
    return
  }

  const viewportHeight = window.innerHeight
  const availableSpace = viewportHeight - y.value

  const maxAllowedHeight = Math.max(40, availableSpace)

  actualHeight.value = Math.min(props.height, maxAllowedHeight)
}

watch(() => activeWindow.value, () => {
  if (activeWindow.value === props.name) {
    zIndex.value = activeZIndex.value
  }
})

onBeforeMount(() => {
  if (props.title) {
    updateTitle(props.name, props.title)
  }
})

onMounted(() => {

  window.addEventListener('resize', calculateHeight)
  window.addEventListener('orientationchange', calculateHeight)
  zIndex.value = activeZIndex.value
})

defineExpose({
  close, pullUp
})
</script>
