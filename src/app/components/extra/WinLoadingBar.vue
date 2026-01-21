<template>
  <div class="progress-track">
    <div class="progress-blocks">
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  height?: number
}>(), {
  height: 20
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
  animation: bounce 2.0s linear infinite alternate;
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
