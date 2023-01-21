<template>
  <button
      ontouchstart
      class="noselect"
      :class="{'d-block': block}"
      @click="emit('click')"
      :disabled="disabled"
  >
    <slot/>
  </button>
</template>

<script setup>
// Emits
const emit = defineEmits(['click'])

// Props
const props = defineProps({
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
