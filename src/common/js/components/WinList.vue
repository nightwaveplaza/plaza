<template>
  <div ref="list" class="list" :class="{scroll: scroll}">
    <table class="hover">
      <slot/>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'

// Props
const props = defineProps({
  scroll: {
    type: Boolean,
    default: false,
  },
})

// Reactive data
const list = ref(null)

// Scrollbar
let scrollbar = {}

// Methods
function scrollTop () {
  list.scrollTop = 0
}

function refreshScrollbar () {
  if (scroll) {
    nextTick(() => {
      scrollbar.update()
    })
  }
}

onMounted(() => {
  if (props.scroll) {
    scrollbar = new PerfectScrollbar(list.value)
  }
})

onBeforeUnmount(() => {
  if (props.scroll) {
    scrollbar.destroy()
    scrollbar = null
  }
})

defineExpose({
  list, scrollTop, refreshScrollbar,
})
</script>
