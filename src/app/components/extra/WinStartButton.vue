<template>
  <win-button
    icon="win_start"
    class="btn-start"
    :class="{ active: isOpen }"
    @click="toggleMenu"
  ></win-button>
</template>

<script setup lang="ts">
  import { useStartMenu } from '@app/composables/useStartMenu.ts';
  const { isOpen, toggleMenu } = useStartMenu();
</script>
