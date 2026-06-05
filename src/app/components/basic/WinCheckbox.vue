<template>
  <label class="win-checkbox">
    <input v-model="checked" type="checkbox" />
    <span class="checkmark me-1"></span>
    <span class="label-text"><slot /></span>
  </label>
</template>

<script setup lang="ts">
  const checked = defineModel<boolean>();
</script>
