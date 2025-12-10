<template>
  <button
    ontouchstart
    class="win-button noselect"
    :class="{'d-block': block}"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  block?: boolean,
  disabled?: boolean
}>(), {
  block: false,
  disabled: false
})

const emit = defineEmits(['click'])
</script>
