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
                <win-btn class="button-close" @click="closeWindow2"><span/></win-btn>
              </div>
            </slot>
          </div>

          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import windowsComposable from '@common/composables/windowsComposable'

const SNAP_SIZE = 15

const store = useStore()

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

// Composable
const { closeWindow2 } = windowsComposable(props.name)

// Reactive data
const style = ref({
  zIndex: 100,
  position: 'relative',
  left: '0px',
  top: '0px',
  transform: '',
  width: '',
})
const windowDefaultPosition = ref([0, 0])
const windowPos = ref([0, 0])
const borders = ref([0, 0])
const offsets = ref([0, 0])
const moving = ref(false)
const activeWindow = computed(() => store.getters['windows/activeWindow'])
const globalZ = computed(() => store.getters['windows/globalZ'])
const isWindowOpen = computed(() => store.getters['windows/isWindowOpen'])
const isWindowMinimized = computed(() => store.getters['windows/isWindowMinimized'])
const isWindowInactive = computed(() => activeWindow.value !== props.name)
const isMinimized = computed(() => isWindowMinimized.value(props.name))

// Refs
const windowRef = ref(null)

watch(windowPos, (newWindowPos) => {
  style.value.left = newWindowPos[0] + 'px'
  style.value.top = newWindowPos[1] + 'px'

})

// Methods
function resetPosition () {
  windowPos.value = [0, 0]
}

function pullUp () {
  store.commit('windows/pullUp', props.name)
  style.value.zIndex = globalZ.value
}

function startMove (event) {
  if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SPAN') {
    return
  }

  recalculatePositions()
  moving.value = true
  offsets.value = [event.offsetX, event.offsetY]
}

function move (event) {
  if (!moving.value) return
  event.preventDefault()

  const mousePos = [event.clientX - offsets.value[0], event.clientY - offsets.value[1]]
  let x = mousePos[0] - windowDefaultPosition.value[0]
  let y = mousePos[1] - windowDefaultPosition.value[1]

  if (mousePos[0] - SNAP_SIZE <= 0) {
    x = 0 - windowDefaultPosition.value[0]
  }

  if (mousePos[1] - SNAP_SIZE <= 0) {
    y = 0 - windowDefaultPosition.value[1]
  }

  if (mousePos[0] + SNAP_SIZE >= borders.value[0]) {
    x = windowDefaultPosition.value[0]
  }

  if (mousePos[1] + SNAP_SIZE >= borders.value[1]) {
    y = borders.value[1] - windowDefaultPosition.value[1]
  }

  windowPos.value = [x, y]
}

function stopMove (event) {
  if (!moving.value) return
  event.preventDefault()

  moving.value = false
}

function recalculatePositions () {
  const newBorders = [
    window.innerWidth - windowRef.value.offsetWidth,
    window.innerHeight - windowRef.value.offsetHeight,
  ]

  if (windowPos.value[0] === 0 && windowPos.value[1] === 0) {
    const rect = windowRef.value.getBoundingClientRect()
    windowDefaultPosition.value = [rect.x, rect.y]
  } else {
    windowDefaultPosition.value[0] += (newBorders[0] - borders.value[0]) / 2
    windowDefaultPosition.value[1] += (newBorders[1] - borders.value[1]) / 2
  }

  borders.value = newBorders
}

function minimize () {
  store.dispatch('windows/minimize', props.name)
}

onBeforeMount(() => {
  store.dispatch('windows/updateTitle', { name: props.name, title: props.title }).then()
})

onMounted(() => {
  style.value.zIndex = globalZ.value
  style.value.width = props.width + 'px'

  if (props.width > 0 && props.width <= 320) {
    style.value.maxWidth = props.width + 'px'
  }

  store.subscribe((mutation, state) => {
    if (mutation.type === 'windows/pullUp' && props.name === state.windows.activeWindow) {
      style.value.zIndex = state.windows.activeZIndex
    }
  })

  window.addEventListener('mouseup', stopMove)
  window.addEventListener('mousemove', move)
  window.addEventListener('resize', recalculatePositions)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', stopMove)
  window.removeEventListener('mousemove', move)
  window.removeEventListener('resize', recalculatePositions)
})
</script>
