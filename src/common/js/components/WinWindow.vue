<template>
  <div :id="'window-' + name" ref="frame" class="frame row align-items-center" v-show="!isMinimized">
    <div :class="{alert: props.isAlert, 'fluid-height': props.fluidHeight}" class="win98 col pl-0 pr-0">
      <div ref="windowRef" :style="style" class="window" @mousedown="pullUp">
        <div class="inner">
          <div class="header header-draggable noselect" @dblclick="resetPosition" @mousedown="startMove"
               :class="{inactive: isWindowInactive}">
            <div class="icon"></div>
            {{ title }}
            <slot name="header">
              <div class="buttons">
                <win-btn class="button-minimize" @click="minimize"><span/></win-btn>
                <win-btn class="button-close" @click="close"><span/></win-btn>
              </div>
            </slot>
          </div>

          <slot :close="close"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const SNAP_SIZE = 15
const windowsStore = useWindowsStore()

const emit = defineEmits(['closed'])

const props = withDefaults(defineProps<{
  title?: string,
  name: string,
  isAlert?: boolean,
  width?: number,
  fluidHeight?: boolean
}>(), {
  width: 500,
  fluidHeight: false,
})

const style: CSSProperties = reactive({
  zIndex: 100,
  position: 'relative',
  left: '0px',
  top: '0px',
  transform: '',
  width: '',
})
const windowPos = ref([0, 0])
const isWindowInactive = computed(() => windowsStore.activeWindow !== props.name)
const isMinimized = computed(() => windowsStore.isMinimized(props.name))
const windowRef = ref<HTMLDivElement | null>(null)

// Non-reactive
let windowDefaultPosition = [0, 0]
let borders = [0, 0]
let offsets = [0, 0]
let moving = false

// Methods
function resetPosition () {
  windowPos.value = [0, 0]
}

function pullUp () {
  windowsStore.pullUp(props.name)
  style.zIndex = windowsStore.activeZIndex
}

function startMove (e: MouseEvent) {
  if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'SPAN') {
    return
  }

  recalculatePositions()
  moving = true
  offsets = [e.offsetX, e.offsetY]
}

function move (e: MouseEvent) {
  if (!moving) return
  e.preventDefault()

  const mousePos = [e.clientX - offsets[0], e.clientY - offsets[1]]
  let x = mousePos[0] - windowDefaultPosition[0]
  let y = mousePos[1] - windowDefaultPosition[1]

  if (mousePos[0] - SNAP_SIZE <= 0) {
    x = 0 - windowDefaultPosition[0]
  }

  if (mousePos[1] - SNAP_SIZE <= 0) {
    y = 0 - windowDefaultPosition[1]
  }

  if (mousePos[0] + SNAP_SIZE >= borders[0]) {
    x = windowDefaultPosition[0]
  }

  if (mousePos[1] + SNAP_SIZE >= borders[1]) {
    y = borders[1] - windowDefaultPosition[1]
  }

  windowPos.value = [x, y]
}

function stopMove (e: Event) {
  if (!moving) return
  e.preventDefault()

  moving = false
}

function recalculatePositions () {
  const newBorders = [
    window.innerWidth - windowRef.value!.offsetWidth,
    window.innerHeight - windowRef.value!.offsetHeight,
  ]

  if (windowPos.value[0] === 0 && windowPos.value[1] === 0) {
    const rect = windowRef.value!.getBoundingClientRect()
    windowDefaultPosition = [rect.x, rect.y]
  } else {
    windowDefaultPosition[0] += (newBorders[0] - borders[0]) / 2
    windowDefaultPosition[1] += (newBorders[1] - borders[1]) / 2
  }

  borders = newBorders
}

function minimize () {
  windowsStore.minimize(props.name)
}

function close () {
  emit('closed')
  windowsStore.close(props.name)
}

watch(() => windowsStore.activeWindow, () => {
  style.zIndex = windowsStore.activeZIndex
})

watch(windowPos, (newWindowPos) => {
  style.left = newWindowPos[0] + 'px'
  style.top = newWindowPos[1] + 'px'
})

onBeforeMount(() => {
  if (props.title) {
    windowsStore.updateTitle(props.name, props.title)
  }
})

onMounted(() => {
  style.zIndex = windowsStore.activeZIndex
  style.width = props.width + 'px'

  if (props.width > 0 && props.width <= 320) {
    style.maxWidth = props.width + 'px'
  }

  window.addEventListener('mouseup', stopMove)
  window.addEventListener('mousemove', move)
  window.addEventListener('resize', recalculatePositions)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', stopMove)
  window.removeEventListener('mousemove', move)
  window.removeEventListener('resize', recalculatePositions)
})

defineExpose({
  close, pullUp,
})
</script>
