<template>
  <div ref="memo" class="memo p-2" :class="{scroll: scroll}">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'

const props = withDefaults(defineProps<{
  scroll?: boolean
}>(), {
  scroll: false,
})

const memo = ref<HTMLDivElement | null>(null)

// Scrollbar
let scrollbar: PerfectScrollbar

onMounted(() => {
  if (props.scroll) {
    scrollbar = new PerfectScrollbar(memo.value!)
  }
})

onBeforeUnmount(() => {
  if (props.scroll) {
    scrollbar.destroy()
  }
})

defineExpose({
  memo,
})
</script>
