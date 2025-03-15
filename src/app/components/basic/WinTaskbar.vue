<template>
  <div class="taskbar d-flex flex-nowrap" :class="{'taskbar-top': settingsStore.taskbarPosition === 'top'}">
    <div style="flex: 0 0 10px">
      <div class="divider mx-1" />
    </div>
    <win-button
      v-for="window in openedWindows"
      :key="window.name"
      class="mr-1" style="flex: 1 1 auto"
      :class="{active: activeWindow === window.name && !window.isMinimized }"
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
import { useSettingsStore } from '@app/stores/settingsStore'
import { i18n } from '@locales/_i18n.ts'
import { useWindows } from '@app/composables/useWindows.ts'

const settingsStore = useSettingsStore()
const { toggleMinimize, openedWindows, activeWindow } = useWindows()

const time = ref('0:00 PM')

function getNow (): void {
  time.value = (new Date()).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { hour: 'numeric', minute: 'numeric' }
  )
}

onBeforeMount(() => {
  getNow()
})

onMounted(() => {
  setInterval(getNow, 1000)
})
</script>
