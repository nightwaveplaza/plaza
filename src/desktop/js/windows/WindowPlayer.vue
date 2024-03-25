<template>
  <win-window ref="win" name="player" title="Nightwave Plaza" :width="450" v-show="loaded">

    <!-- Minimize button -->
    <template v-slot:header>
      <div class="buttons">
        <win-btn class="button-minimize" @click="minimize"><span/></win-btn>
        <win-btn v-if="fullScreenEnabled" class="button-maximize" @click="requestFullScreen"><span/></win-btn>
      </div>
    </template>

    <!-- Menu -->
    <win-menu/>

    <!-- Player -->
    <div class="content p-1 p-sm-2">
      <win-player/>
    </div>

    <!-- Statusbar -->
    <div class="statusbar row no-gutters">
      <div class="col cell">
        Listeners: {{ playerPlaybackStore.listeners }}
      </div>
      <div v-if="userAuthStore.signed" class="col-5 col-sm-3 cell login">
        Logged as: {{ userAuthStore.username }}
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'

const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()

// Reactive data
const fullScreenEnabled = computed(() => document.fullscreenEnabled)
const loaded = ref(false)
const win = ref<InstanceType<typeof WinWindow>>()

// Methods
function minimize () {
  windowsStore.minimize('player')
}

function requestFullScreen () {
  document.getElementById('app')?.requestFullscreen()
}

onMounted(() => {
  playerPlaybackStore.$subscribe((mutation, state) => {
    if (loaded.value === false) {
      windowsStore.close('loading')
      loaded.value = true
      win.value!.pullUp()
    }
  })
})
</script>
