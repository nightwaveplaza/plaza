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

<script setup lang="ts">
const emit = defineEmits(['click'])

const props = withDefaults(defineProps<{
  block?: boolean,
  disabled?: boolean
}>(), {
  block: false,
  disabled: false
})
</script>
