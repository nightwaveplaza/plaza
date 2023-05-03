<template>
  <win-window name="player" title="Nightwave Plaza" :width="400">

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
        Listeners: {{ listeners }}
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Native } from '@mobile/js/bridge/native'

const store = useStore()

// Reactive data
const listeners = computed(() => store.getters['player/listeners'])

// Methods
function minimize () {
  store.dispatch('windows/minimize', 'player')
}

function toggleFullscreen () {
  Native.toggleFullscreen()
}
</script>
