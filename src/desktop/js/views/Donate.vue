<template>
  <div class="app-desktop theme-win98">
    <window-support :direct="true"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const windowsStore = useWindowsStore()

onMounted(() => {
  windowsStore.pullUp('support')
})
</script>
