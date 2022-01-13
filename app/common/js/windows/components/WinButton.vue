<template>
  <button
      ontouchstart
      class="noselect"
      :class="{'d-block': block}"
      @click="$emit('click')"
      :disabled="disabled"
  >
    <slot/>
  </button>
</template>

<script>
export default {
  props: {
    block: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
