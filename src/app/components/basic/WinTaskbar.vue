<template>
  <div class="taskbar d-flex flex-nowrap" :class="{'taskbar-top': settingsStore.taskbarPosition === 'top'}">
    <div style="flex: 0 0 10px">
      <div class="divider mx-1" />
    </div>
    <win-button
      v-for="window in windowsStore.windows"
      :key="window.name"
      class="mr-1" style="flex: 1 1 auto"
      :class="{active: windowsStore.activeWindow === window.name && !windowsStore.isMinimized(window.name)}"
      @click="toggleMinimize(window.name)"
    >
      <img src="@app/assets/img/ball.png" alt="">
      <div class="title">
        {{ window.title }}
      </div>
    </win-button>

    <div class="local-time ml-auto" style="flex: 0 0 60px">
      {{ time }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useWindowsStore } from '@app/stores/windowsStore'
import { useSettingsStore } from '@app/stores/settingsStore'
import { i18n } from '@locales/_i18n.ts'

const windowsStore = useWindowsStore()
const settingsStore = useSettingsStore()

const time = ref('0:00 PM')

function getNow (): void {
  time.value = (new Date()).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { hour: 'numeric', minute: 'numeric' }
  )
}

function toggleMinimize (name: string): void {
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
