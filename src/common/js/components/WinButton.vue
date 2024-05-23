<template>
  <button
    ontouchstart
    class="noselect"
    :class="{'d-block': block}"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

withDefaults(defineProps<{
  block?: boolean,
  disabled?: boolean
}>(), {
  block: false,
  disabled: false
})
</script>
