<template>
  <div class="group-box" :class="props.class">
    <div class="gb-label noselect">
      <span><slot name="title"></slot></span>
    </div>
    <div class="gb-body p-2">
      <div class="mt-1">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  class: string
}>(), {
  class: "",
})
</script>