<template>
  <div ref="memo" class="memo p-2" :class="{scroll: scroll}">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'

// Props
const props = defineProps({
  scroll: {
    type: Boolean,
    default: false,
  },
})

// Reactive data
const memo = ref(null)

// Scrollbar
let scrollbar = {}

// Methods
onMounted(() => {
  if (props.scroll) {
    scrollbar = new PerfectScrollbar(memo.value)
  }
})

onBeforeUnmount(() => {
  if (props.scroll) {
    scrollbar.destroy()
    scrollbar = null
  }
})

defineExpose({
  memo,
})
</script>
