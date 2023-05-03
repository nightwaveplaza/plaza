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
            <win-btn block @click="openWindow2('player-timer')">
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
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Native } from '@mobile/js/bridge/native'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()

// Composable
const { openWindow2, closeWindow2 } = windowsComposable()

// Reactive data
const currentSong = computed(() => store.getters['player/currentSong'])
const isPlaying = computed(() => store.getters['isPlaying'])
const sleepTime = computed(() => store.getters['sleepTime'])
const artwork = computed(() => {
  if (currentSong.value.id && currentSong.value.artwork_src)
    return currentSong.value.artwork_src
  else
    return 'https://i.plaza.one/dead.jpg'
})
const playText = computed(() => isPlaying.value ? 'Stop' : 'Play')
const timerColor = computed(() => sleepTime.value !== 0 ? '#3455DB' : '')

function play () {
  if (!isPlaying.value) {
    Native.audioPlay()
  } else {
    Native.audioStop()
    closeWindow2('player-timer')
  }
}

function openDrawer () {
  Native.openDrawer()
}
</script>
