<template>
  <div class="app-desktop theme-win98">
    <window-support :direct="true" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindowsStore } from '@app/stores/windowsStore'

const windowsStore = useWindowsStore()

onMounted(() => {
  windowsStore.pullUp('support')
})
</script>
