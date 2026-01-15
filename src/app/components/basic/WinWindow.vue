<template>
  <div v-show="!isMinimized" :id="'window-' + name" :class="{alert: props.isAlert}">
    <div ref="windowRef" class="win-window" :style="style" @mousedown="pullUp">
      <div class="inner">
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

        <slot :close="close" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useDraggable } from '@app/composables/useDraggable.ts'

const emit = defineEmits(['closed'])
const { openedWindows, activeWindow, activeZIndex, pullUp: pullUpWindow, minimizeWindow, closeWindow, updateTitle } = useWindows()


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

const style = computed(() => ({
  zIndex,
  position: 'absolute',
  left: `${x.value}px`,
  top: `${y.value}px`,
  transform: '',
  width: `${props.width}px`,
  maxWidth: props.width > 0 && props.width <= 320 ? `${props.width}px` : 'default'
}))

const isMinimized = computed(() => openedWindows.value[props.name]?.isMinimized)
const isActive = computed(() => activeWindow.value === props.name)
const windowRef = ref<HTMLDivElement | null>(null)
const zIndex = ref(100)
const { centerWindow, handleDragStart, x, y } = useDraggable(windowRef)

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

watch(() => activeWindow.value, () => {
  if (activeWindow.value === props.name) {
    zIndex.value = activeZIndex.value
  }
})

onBeforeMount(() => {
  centerWindow()
  if (props.title) {
    updateTitle(props.name, props.title)
  }
})

onMounted(() => {
  zIndex.value = activeZIndex.value
})

defineExpose({
  close, pullUp
})
</script>
