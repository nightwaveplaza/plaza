<template>
  <div v-show="!isMinimized" :id="'window-' + name" ref="frame" class="frame row align-items-center">
    <div :class="{alert: props.isAlert, 'fluid-height': props.fluidHeight}" class="win98 col pl-0 pr-0">
      <div ref="windowRef" class="window" :style="style" @mousedown="pullUp">
        <div class="inner">
          <div class="header header-draggable noselect" :class="{inactive: isWindowInactive}"
               @dblclick="resetPosition" @mousedown="startMove"
          >
            <div class="icon" />
            {{ title }}
            <slot name="header">
              <div class="buttons">
                <win-btn class="button-minimize" @click="minimize">
                  <span />
                </win-btn>
                <win-btn class="button-close" @click="close">
                  <span />
                </win-btn>
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
  title: ' ',
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
let winDefPositionX = 0
let winDefPositionY = 0
let borderX = 0
let borderY = 0
let offsetX = 0
let offsetY = 0
let moving = false

// Methods
function resetPosition (): void {
  windowPos.value = [0, 0]
}

function pullUp (): void {
  windowsStore.pullUp(props.name)
  style.zIndex = windowsStore.activeZIndex
}

function startMove (e: MouseEvent): void {
  if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'SPAN') {
    return
  }

  recalculatePositions()
  moving = true
  offsetX = e.offsetX
  offsetY = e.offsetY
}

function move (e: MouseEvent): void {
  if (!moving) {return}
  e.preventDefault()

  const mousePosX = e.clientX - offsetX
  const mousePosY = e.clientY - offsetY
  let x = mousePosX - winDefPositionX
  let y = mousePosY - winDefPositionY

  if (mousePosX - SNAP_SIZE <= 0) {
    x = 0 - winDefPositionX
  }

  if (mousePosY - SNAP_SIZE <= 0) {
    y = 0 - winDefPositionY!
  }

  if (mousePosX + SNAP_SIZE >= borderX) {
    x = winDefPositionX
  }

  if (mousePosY + SNAP_SIZE >= borderY) {
    y = borderY - winDefPositionY
  }

  windowPos.value = [x, y]
}

function stopMove (e: Event): void {
  if (!moving) {return}
  e.preventDefault()

  moving = false
}

function recalculatePositions (): void {
  const newBorderX = window.innerWidth - windowRef.value!.offsetWidth
  const newBorderY = window.innerHeight - windowRef.value!.offsetHeight

  if (windowPos.value[0] === 0 && windowPos.value[1] === 0) {
    const rect = windowRef.value!.getBoundingClientRect()
    winDefPositionX = rect.x
    winDefPositionY = rect.y
  } else {
    winDefPositionX += (newBorderX - borderX) / 2
    winDefPositionY += (newBorderY - borderY) / 2
  }

  borderX = newBorderX
  borderY = newBorderY
}

function minimize (): void {
  windowsStore.minimize(props.name)
}

function close (): void {
  emit('closed')
  windowsStore.close(props.name)
}

watch(() => windowsStore.activeWindow, () => {
  if (windowsStore.activeWindow === props.name) {
    style.zIndex = windowsStore.activeZIndex
  }
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
