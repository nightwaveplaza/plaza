<template>
  <div ref="list" class="list" :class="{scroll}">
    <simplebar v-if="scroll" ref="scrollbar" data-simplebar-auto-hide="false">
      <table class="hover">
        <slot />
      </table>
    </simplebar>
    <table v-else class="hover">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import simplebar from 'simplebar-vue'

withDefaults(defineProps<{
  // Enable scrolling
  scroll?: boolean
}>(), {
  scroll: false,
})

// Refs to DOM
const list = ref<HTMLDivElement | null>(null)
const scrollbar = ref<{ recalculate (): void } | null>(null)

function scrollTop (): void {
  scrollbar.value?.recalculate()
}

defineExpose({
  list, scrollTop,
})
</script>
