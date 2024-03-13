<template>
  <win-window ref="win" name="player" title="Nightwave Plaza" :width="400" v-show="loaded">

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
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Native } from '@mobile/js/bridge/native'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()
const loaded = ref(false)
const win = ref('win')

const { closeWindow } = windowsComposable()

// Reactive data
const listeners = computed(() => store.getters['player/listeners'])

// Methods
function minimize () {
  store.dispatch('windows/minimize', 'player')
}

function toggleFullscreen () {
  Native.toggleFullscreen()
}

onMounted(() => {
  store.subscribe((mutation) => {
    if (mutation.type === 'player/currentSong' && loaded.value === false) {
      closeWindow('loading')
      loaded.value = true
      win.value.pullUp()
    }
  })
})
</script>
