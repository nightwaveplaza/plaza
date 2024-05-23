<template>
  <div class="app-desktop theme-win98">
    <window-user-register :direct="true" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const windowsStore = useWindowsStore()

onMounted(() => {
  windowsStore.pullUp('user-register')
})
</script>
