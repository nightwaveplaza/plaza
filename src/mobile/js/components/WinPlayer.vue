<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork"/>
      </div>
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">{{ playerPlaybackStore.artist }}</div>
        <div class="player-title track-title">{{ playerPlaybackStore.title }}</div>

        <div class="row my-1 my-sm-2 py-1 no-gutters noselect">
          <div class="col-12 col-md-6 pr-0">
            <div class="text-field p-0 m-0 player-time-container">
              <win-player-time/>
            </div>
          </div>
        </div>

        <div class="row no-gutters">
          <div :class="{'col-6': !nativeStateStore.playing, 'col-4': nativeStateStore.playing}" class="mb-1 mb-sm-0 pr-2">
            <win-button class="player-play" block @click="play">{{ playText }}</win-button>
          </div>

          <div v-if="nativeStateStore.playing" class="col-2 mb-1 mb-sm-0 pr-2">
            <win-button block @click="windowsStore.open('player-timer')">
              <i :style="{ color: timerColor }" class="i icon-clock"/>
            </win-button>
          </div>

          <div class="col-3 pr-2">
            <win-player-reactions/>
          </div>

          <div class="col-3 mb-1 mb-sm-0">
            <win-button block class="btn-start" @click="openDrawer">&nbsp;</win-button>
          </div>
        </div>
      </div>
    </div>

    <win-player-status ref="status"/>
  </div>
</template>

<script setup lang="ts">
import useEmitter from '@mobile/js/extra/useEmitter'
import { computed, onMounted, ref } from 'vue'
import { Native } from '@mobile/js/bridge/native'
import { useWindowsStore } from '@app/stores/windowsStore'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore'
import { useNativeStateStore } from '@mobile/js/stores/nativeStateStore'

const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()
const nativeStateStore = useNativeStateStore()
const emitter = useEmitter()

// Reactive data
const isBuffering = ref(false)
const sleepTime = computed(() => nativeStateStore.sleepTime)
const artwork = computed(() => {
  if (playerPlaybackStore.songId && playerPlaybackStore.artwork_src)
    return playerPlaybackStore.artwork_src
  else
    return 'https://i.plaza.one/artwork_dead.jpg'
})
const playText = computed(() => isBuffering.value ? 'Loading...' : nativeStateStore.playing ? 'Stop' : 'Play')
const timerColor = computed(() => sleepTime.value !== 0 ? '#3455DB' : '')

function play () {
  if (nativeStateStore.playing) {
    windowsStore.close('player-timer')
  }
  Native.audioPlay()
}

function openDrawer () {
  Native.openDrawer()
}

onMounted(() => {
  emitter.on('isPlaying', (isPlaying: boolean) => {
    isBuffering.value = false
    nativeStateStore.playing = isPlaying
  })

  emitter.on('isBuffering', () => {
    isBuffering.value = true
  })

  emitter.on('sleepTime', (sleepTime: number) => {
    nativeStateStore.sleepTime = sleepTime
  })
})
</script>
