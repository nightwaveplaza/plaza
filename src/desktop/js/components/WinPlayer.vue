<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0 px-4 px-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork" @click="showSongInfo"/>
      </div>
      <audio ref="audio" crossorigin="anonymous" preload="auto" @loadedmetadata="audioCanPlay"/>
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">{{ playerPlaybackStore.artist }}</div>
        <div class="player-title track-title">{{ playerPlaybackStore.title }}</div>

        <div class="row my-1 my-sm-2 py-1 no-gutters noselect">
          <div class="col-12 col-md-7 pr-0 pr-md-2">
            <div class="text-field p-0 m-0 player-time-container">
              <canvas ref="canvas" class="player-visual"/>
              <win-player-time ref="time"/>
            </div>
          </div>

          <div class="col col-md-5 d-none d-md-block">
            <win-player-volume @onchange="setVolume" @onload="updateVolume"/>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="col-6 col-md-7 pr-md-2">
            <div class="row no-gutters">
              <div class="col-6 col-md-8">
                <win-btn class="player-play" block @click="play()" v-html="playText"/>
              </div>
              <div class="col-6 col-md-4">
                <win-player-reactions/>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-5">
            <div class="row no-gutters">
              <div class="col-6">
                <win-btn block @click="userAuthStore.signed ? windowsStore.open('user') : windowsStore.open('user-login')">
                  <i class="i icon-user mr-0"/>
                </win-btn>
              </div>
              <div class="col-6">
                <win-btn block @click="windowsStore.open('settings-background')">
                  <i class="i icon-cog mr-0"/>
                </win-btn>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <win-player-status ref="status"/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import visualComposable from '@common/js/composables/visualComposable'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import type WinPlayerTime from '@common/js/components/WinPlayerTime.vue'
import { MutationType } from 'pinia'

// const
const STATE_IDLE = 0
const STATE_LOADING = 1
const STATE_PLAYING = 2

const { startVisual } = visualComposable()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()

const audio = ref<InstanceType<typeof HTMLAudioElement>>()
const time = ref<InstanceType<typeof WinPlayerTime>>()
const canvas = ref<InstanceType<typeof HTMLCanvasElement>>()
const state = ref(STATE_IDLE)

const artwork = computed(() => {
  if (playerPlaybackStore.songId && playerPlaybackStore.artwork_src) return playerPlaybackStore.artwork_src
  else return 'https://i.plaza.one/artwork_dead.jpg'
})
const playText = computed(() => {
  if (state.value === STATE_IDLE) return 'Play'
  else if (state.value === STATE_LOADING) return 'Loading...'
  else return 'Stop'
})

// Non-reactive
let offline = false
let volume = 100

function updateSong () {
  if (offline && state.value === STATE_PLAYING) {
    stopPlay()
    setTimeout(play, 2000)
  }

  if (state.value === STATE_PLAYING) {
    document.title = `${playerPlaybackStore.artist} - ${playerPlaybackStore.title}`
    updateMediaSession()
  }

  offline = false
}

function play () {
  if (navigator.mediaSession && navigator.mediaSession.playbackState !== 'playing' && state.value !== STATE_IDLE) {
    state.value = STATE_IDLE
  }

  if (state.value === STATE_IDLE) {
    state.value = STATE_LOADING
    startPlay()
  } else {
    stopPlay()
  }
}

function startPlay () {
  const noCacheStr = 'nocache=' + Date.now()
  audio.value!.type = 'audio/mpeg'
  audio.value!.src = 'https://radio.plaza.one/mp3?' + noCacheStr

  audio.value!.load()
  audio.value!.volume = volume

  document.title = `${playerPlaybackStore.artist} - ${playerPlaybackStore.title}`
}

function audioCanPlay () {
  if (state.value === STATE_LOADING) {
    state.value = STATE_PLAYING

    audio.value!.play().then(() => {
      startVisual(audio.value!, canvas.value!)
      updateMediaSession()
      setMediaSessionState('playing')
    }).catch(e => console.log(e))
  }
}

function stopPlay () {
  audio.value!.pause()
  audio.value!.currentTime = 0

  state.value = STATE_IDLE
  setMediaSessionState('paused')
  document.title = 'Nightwave Plaza - Online Vaporwave Radio'
}

function setVolume (volume: number) {
  updateVolume(volume)
  time.value!.showText('Volume: ' + volume + '%')
}

function updateVolume (newVolume: number) {
  volume = newVolume / 100
  if (state.value === STATE_PLAYING) {
    audio.value!.volume = volume
  }
}

function showSongInfo () {
  if (playerPlaybackStore.songId) {
    windowsStore.showSong(playerPlaybackStore.songId)
  }
}

function updateMediaSession () {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playerPlaybackStore.title,
      artist: playerPlaybackStore.artist,
      album: playerPlaybackStore.album,
      artwork: [
        { src: playerPlaybackStore.artwork_sm_src, sizes: '300x300', type: 'image/jpg' },
        { src: playerPlaybackStore.artwork_src, sizes: '500x500', type: 'image/jpg' },
      ],
    })
  } else {
    console.log('No media session')
  }
}

function setMediaSessionActions () {
  if ('mediaSession' in navigator) {
    const actionHandlers = [
      ['play', play],
      ['pause', play],
      ['stop', play],
    ]

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler as MediaSessionActionHandler)
      } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`)
      }
    }
  }
}

function setMediaSessionState (state: string) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = state as MediaSessionPlaybackState
  }
}

onMounted(() => {
  playerPlaybackStore.$subscribe((mutation, state) => {
    if (mutation.type === MutationType.patchObject) {
      updateSong()
    }
  })

  setMediaSessionActions()
})
</script>
