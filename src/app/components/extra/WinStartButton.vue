<template>
  <win-button class="btn-start text-center" @click="openMenu">
    <img src="@app/assets/img/windows-0.png" />
  </win-button>
</template>

<script setup lang="ts">
  import { useStartMenu } from '@app/composables/useStartMenu.ts';

  const { openMenu } = useStartMenu();
</script>
