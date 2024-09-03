<template>
  <div ref="list" class="list" :class="{scroll}">
    <simplebar v-if="scroll" ref="scrollbar" data-simplebar-auto-hide="false">
      <table class="hover">
        <slot />
      </table>
    </simplebar>
    <table class="hover" v-else>
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import simplebar from 'simplebar-vue'

// Props
withDefaults(defineProps<{
  scroll?: boolean
}>(), {
  scroll: false,
})

// Elements
const list = ref<HTMLDivElement | null>(null)
const scrollbar = ref<{ recalculate (): void } | null>(null)

// Methods
function scrollTop (): void {
  scrollbar.value?.recalculate()
}

defineExpose({
  list, scrollTop,
})
</script>
