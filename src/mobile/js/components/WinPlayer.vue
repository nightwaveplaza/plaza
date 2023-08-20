<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork"/>
      </div>
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">{{ currentSong.artist }}</div>
        <div class="player-title track-title">{{ currentSong.title }}</div>

        <div class="row my-1 my-sm-2 py-1 no-gutters noselect">
          <div class="col-12 col-md-6 pr-0">
            <div class="text-field p-0 m-0 player-time-container">
              <win-player-time/>
            </div>
          </div>
        </div>

        <div class="row no-gutters">
          <div :class="{'col-6': !isPlaying, 'col-4': isPlaying}" class="mb-1 mb-sm-0 pr-2">
            <win-btn class="player-play" block @click="play">{{ playText }}</win-btn>
          </div>

          <div v-if="isPlaying" class="col-2 mb-1 mb-sm-0 pr-2">
            <win-btn block @click="openWindow('player-timer')">
              <i :style="{ color: timerColor }" class="i icon-clock"/>
            </win-btn>
          </div>

          <div class="col-3 pr-2">
            <win-player-reactions/>
          </div>

          <div class="col-3 mb-1 mb-sm-0">
            <win-btn block class="btn-start" @click="openDrawer">&nbsp;</win-btn>
          </div>
        </div>
      </div>
    </div>

    <win-player-status ref="status"/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Native } from '@mobile/js/bridge/native'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()

// Composable
const { openWindow, closeWindow } = windowsComposable()

// Reactive data
const isBuffering = ref(false)
const currentSong = computed(() => store.getters['player/currentSong'])
const isPlaying = computed(() => store.getters['isPlaying'])
const sleepTime = computed(() => store.getters['sleepTime'])
const artwork = computed(() => {
  if (currentSong.value.id && currentSong.value.artwork_src)
    return currentSong.value.artwork_src
  else
    return 'https://i.plaza.one/artwork_dead.jpg'
})
const playText = computed(() => isBuffering.value ? 'Loading...' : isPlaying.value ? 'Stop' : 'Play')
const timerColor = computed(() => sleepTime.value !== 0 ? '#3455DB' : '')

function play () {
  if (isPlaying.value) {
    closeWindow('player-timer')
  }
  Native.audioPlay()
}

function openDrawer () {
  Native.openDrawer()
}

onMounted(() => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'pushData') {

      if (mutation.payload.name === 'isPlaying') {
        isBuffering.value = false
        store.commit('isPlaying', state.data.isPlaying)
      }

      if (mutation.payload.name === 'isBuffering') {
        isBuffering.value = true
      }

      if (mutation.payload.name === 'sleepTime') {
        store.commit('sleepTime', state.data.sleepTime)
      }
    }
  })
})
</script>
