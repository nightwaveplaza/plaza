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

          <slot :close="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const SNAP_SIZE = 15

const windowsStore = useWindowsStore()

// Props
const props = defineProps({
  title: String,
  name: String,
  isAlert: Boolean,
  width: {
    type: Number,
    default: 500,
  },
  fluidHeight: {
    type: Boolean,
    default: false,
  },
})

// Reactive data
const style = ref({
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

// Refs
const windowRef = ref(null)

// Emits
const emit = defineEmits(['closed'])

// Non-reactive
let windowDefaultPosition = [0, 0]
let borders = [0, 0]
let offsets = [0, 0]
let moving = false

watch(windowPos, (newWindowPos) => {
  style.value.left = newWindowPos[0] + 'px'
  style.value.top = newWindowPos[1] + 'px'
})

// Methods
function resetPosition () {
  windowPos.value = [0, 0]
}

function pullUp () {
  windowsStore.pullUp(props.name)
  style.value.zIndex = windowsStore.activeZIndex
}

function startMove (event) {
  if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SPAN') {
    return
  }

  recalculatePositions()
  moving = true
  offsets = [event.offsetX, event.offsetY]
}

function move (event) {
  if (!moving) return
  event.preventDefault()

  const mousePos = [event.clientX - offsets[0], event.clientY - offsets[1]]
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

function stopMove (event) {
  if (!moving) return
  event.preventDefault()

  moving = false
}

function recalculatePositions () {
  const newBorders = [
    window.innerWidth - windowRef.value.offsetWidth,
    window.innerHeight - windowRef.value.offsetHeight,
  ]

  if (windowPos.value[0] === 0 && windowPos.value[1] === 0) {
    const rect = windowRef.value.getBoundingClientRect()
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

function close() {
  emit('closed')
  windowsStore.close(props.name)
}

watch(() => windowsStore.activeWindow, () => {
  style.value.zIndex = windowsStore.activeZIndex
})

onBeforeMount(() => {
  windowsStore.updateTitle(props.name, props.title)
})

onMounted(() => {
  style.value.zIndex = windowsStore.activeZIndex
  style.value.width = props.width + 'px'

  if (props.width > 0 && props.width <= 320) {
    style.value.maxWidth = props.width + 'px'
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
  close, pullUp
})
</script>
