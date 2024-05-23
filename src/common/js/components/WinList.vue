<template>
  <div ref="list" class="list" :class="{scroll: scroll}">
    <table class="hover">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'

// Props
const props = withDefaults(defineProps<{
  scroll?: boolean
}>(), {
  scroll: false,
})

// Elements
const list = ref<HTMLDivElement | null>(null)

// Scrollbar
let scrollbar: PerfectScrollbar

// Methods
function scrollTop (): void {
  list.value!.scrollTop = 0
}

function refreshScrollbar (): void {
  if (props.scroll) {
    nextTick(() => {
      scrollbar.update()
    })
  }
}

onMounted(() => {
  if (props.scroll) {
    scrollbar = new PerfectScrollbar(list.value!)
  }
})

onBeforeUnmount(() => {
  if (props.scroll) {
    scrollbar.destroy()
  }
})

defineExpose({
  list, scrollTop, refreshScrollbar,
})
</script>
