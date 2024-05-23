<template>
  <win-window ref="win" name="player" title="Nightwave Plaza" :width="400">

    <!-- Minimize button -->
    <template v-slot:header>
      <div class="buttons">
        <win-btn class="button-minimize" @click="minimize"><span/></win-btn>
        <win-btn class="button-maximize" @click="toggleFullscreen"><span/></win-btn>
      </div>
    </template>

    <!-- Player -->
    <div class="content p-2">
      <win-player/>
    </div>

    <!-- Statusbar -->
    <div class="statusbar row no-gutters">
      <div class="col cell">
        Listeners: {{ playerPlaybackStore.listeners }}
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Native } from '@mobile/js/bridge/native'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'

const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()

const win = ref<InstanceType<typeof WinWindow>>()

// Methods
function minimize (): void {
  windowsStore.minimize('player')
}

function toggleFullscreen (): void {
  Native.toggleFullscreen()
}
</script>
