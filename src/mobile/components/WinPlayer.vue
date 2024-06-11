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
import { computed, onMounted, ref } from 'vue'
import { Native } from '@mobile/bridge/native'
import { useWindowsStore } from '@app/stores/windowsStore'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore'
import { useNativeStateStore } from '@mobile/stores/nativeStateStore'
import { eventBus } from '@mobile/events/eventBus.ts'

const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()
const nativeStateStore = useNativeStateStore()

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
  eventBus.on('isPlaying', (isPlaying: boolean) => {
    isBuffering.value = false
    nativeStateStore.playing = isPlaying
  })

  eventBus.on('isBuffering', () => {
    isBuffering.value = true
  })

  eventBus.on('sleepTime', (sleepTime: number) => {
    nativeStateStore.sleepTime = sleepTime
  })
})
</script>

<style lang="scss">
#window-player {
  .player-artist {
    margin-top: 2px;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
  }

  .player-title {
    font-size: 14px;
    line-height: 100%;
  }

  .cover {
    background: #efe6eb;
    padding: 0;
    line-height: 0;
    height: auto;
    width: 112px;
  }

  .cover img {
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .player-time-container {
    margin: 6px 0 3px 0;
    position: relative;
  }

  .player-time {
    position: relative;
    z-index: 2;
    line-height: 24px;
    font-size: 14px;
    text-align: center;
  }

  .player-button i, .player-button span {
    cursor: pointer;
  }
}

@media (max-width: 500px) {
  .cover {
    width: 100% !important;
  }

  .player-meta {
    text-align: center;
  }

  #window-player .win98 .window {
    width: 90% !important;
  }
}
</style>
