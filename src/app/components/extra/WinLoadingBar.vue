<template>
  <div ref="trackRef" class="progress-track">
    <div class="progress-blocks" :style="{ animationDuration: dynamicDuration }">
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  height?: number
}>(), {
  height: 20
})

const trackRef = ref<HTMLDivElement | null>(null)
const trackWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

const dynamicDuration = computed(() => {
  if (!trackWidth.value) return '0s'
  const seconds = trackWidth.value / 125 // speed
  return `${seconds}s`
})

onMounted(() => {
  if (trackRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        trackWidth.value = entry.contentRect.width
      }
    })

    resizeObserver.observe(trackRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver && trackRef.value) {
    resizeObserver.unobserve(trackRef.value)
  }
})

const cssHeight = computed(() => {
  return `${props.height}px`
})
</script>

<style lang="scss" scoped>
.progress-track {
  position: relative;
  height: v-bind(cssHeight);
  border: 1px solid #808080;
  border-right-color: #dfdfdf;
  border-bottom-color: #dfdfdf;
  overflow: hidden;
}

.progress-blocks {
  position: absolute;
  top: 2px;
  bottom: 2px;
  display: flex;
  gap: 1px;
  animation-name: bounce;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.block {
  width: 10px;
  background-color: #072269;
  height: 100%;
}

@keyframes bounce {
  0% {
    left: 0;
    transform: translateX(0);
  }
  100% {
    left: 100%;
    transform: translateX(-100%);
  }
}
</style>
