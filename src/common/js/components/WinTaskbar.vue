<template>
  <div class="taskbar d-flex flex-nowrap">
    <div style="flex: 0 0 10px">
      <div class="divider mx-1"/>
    </div>
    <win-btn class="mr-1" style="flex: 1 1 auto"
             :class="{active: windowsStore.activeWindow === window.name && !windowsStore.isMinimized(window.name)}"
             v-for="window in windowsStore.windows"
             :key="window.name"
             @click="toggleMinimize(window.name)">
      <img src="@common/img/ball.png"/>
      <div class="title" v-html="window.title"/>
    </win-btn>

    <div class="local-time ml-auto" style="flex: 0 0 60px">{{ time }}</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const windowsStore = useWindowsStore()

const time = ref('0:00 PM')

function getNow () {
  time.value = (new Date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

function toggleMinimize (name: string) {
  if (windowsStore.isMinimized(name)) {
    windowsStore.restore(name)
  } else {
    if (windowsStore.activeWindow === name) {
      windowsStore.minimize(name)
    } else {
      windowsStore.pullUp(name)
    }
  }
}

onBeforeMount(() => {
  getNow()
})

onMounted(() => {
  setInterval(getNow, 1000)
})
</script>
