<template>
  <win-window ref="win" name="player" title="Nightwave Plaza" :width="400">

    <!-- Minimize button -->
    <template v-slot:header>
      <div class="buttons">
        <win-button class="button-minimize" @click="minimize"><span/></win-button>
        <win-button class="button-maximize" @click="toggleFullscreen"><span/></win-button>
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
import { useWindowsStore } from '@app/stores/windowsStore'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore'

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
