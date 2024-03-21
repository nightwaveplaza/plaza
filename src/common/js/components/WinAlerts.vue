<template>
  <div>
    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>
  </div>
</template>

<script setup lang="ts">
import { useWindowsStore } from '@common/js/stores/windowsStore'
const windowsStore = useWindowsStore()
</script>
