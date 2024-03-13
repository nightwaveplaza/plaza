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
        Listeners: {{ listeners }}
      </div>
      <div v-if="auth" class="col-5 col-sm-3 cell login">
        Logged as: {{ username }}
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()

const { closeWindow, openWindow } = windowsComposable()

// Reactive data
const listeners = computed(() => store.getters['player/listeners'])
const auth = computed(() => store.getters['user/auth'])
const username = computed(() => store.getters['user/username'])
const fullScreenEnabled = computed(() => document.fullscreenEnabled)
const loaded = ref(false)
const win = ref('win')

// Methods
function minimize () {
  store.dispatch('windows/minimize', 'player')
}

function requestFullScreen () {
  document.getElementById('app').requestFullscreen()
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
