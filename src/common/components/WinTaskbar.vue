<template>
  <div class="taskbar d-flex flex-nowrap">
    <div style="flex: 0 0 10px">
      <div class="divider mx-1"/>
    </div>
    <win-btn class="mr-1" style="flex: 1 1 auto"
             :class="{active: activeWindow === window.name && !isWindowMinimized(window.name)}"
             v-for="window in windows"
             :key="window.name"
             @click="toggleMinimize(window.name)">
      <img src="img/win/ball.png"/>
      <div class="title" v-html="window.title"/>
    </win-btn>

    <div class="local-time ml-auto" style="flex: 0 0 60px">{{ time }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import ticker from '@common/extras/ticker'

const store = useStore()

// Reactive data
const time = ref('0:00 PM')
const isWindowOpen = computed(() => store.getters['windows/isWindowOpen'])
const windows = computed(() => store.getters['windows/windows'])
const activeWindow = computed(() => store.getters['windows/activeWindow'])
const isWindowMinimized = computed(() => store.getters['windows/isWindowMinimized'])

// Methods
function getNow () {
  time.value = (new Date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

function toggleMinimize (name) {
  if (isWindowMinimized.value(name)) {
    store.dispatch('windows/restore', name)
  } else {
    if (activeWindow.value === name) {
      store.dispatch('windows/minimize', name)
    } else {
      store.commit('windows/pullUp', name)
    }
  }
}

onMounted(() => {
  ticker.set(getNow, 1000)
})
</script>
