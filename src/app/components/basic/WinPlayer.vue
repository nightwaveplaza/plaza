<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0 px-4 px-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork" @click="showSongInfo">
      </div>
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">
          {{ playerSongStore.artist }}
        </div>
        <div class="player-title track-title">
          {{ playerSongStore.title }}
        </div>

        <div class="row my-1 my-sm-2 py-1 no-gutters noselect">
          <div class="col-12 col-md-7 pr-0 pr-md-2">
            <div class="text-field p-0 m-0 player-time-container">
              <canvas ref="canvas" class="player-visual" />
              <win-player-time ref="time" @stop-by-timer="stopPlay" />
            </div>
          </div>

          <div class="col col-md-5 d-none d-md-block">
            <win-player-volume @onchange="setVolume" @onload="updateVolume" />
          </div>
        </div>

        <div class="row no-gutters">
          <div class="col-8 col-md-7 pr-md-2">
            <div class="row no-gutters">
              <div :class="{'col-8': !isPlaying, 'col-md-5': isPlaying, 'col-5': isPlaying}">
                <win-button class="player-play" block @click="play()">
                  {{ playText }}
                </win-button>
              </div>
              <div v-if="isPlaying" class="col-3">
                <win-button block @click="openTimerWindow">
                  <i :style="{ color: timerColor }" class="i icon-clock" />
                </win-button>
              </div>
              <div class="col-4">
                <win-player-reactions />
              </div>
            </div>
          </div>
          <div class="col-4 col-md-5">
            <div class="row no-gutters">
              <div class="col-6">
                <win-button block @click="openUserWindow()">
                  <i class="i icon-user mr-0" />
                </win-button>
              </div>
              <div class="col-6">
                <win-button block @click="windowsStore.open('settings')">
                  <i class="i icon-cog mr-0" />
                </win-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <win-player-status ref="status" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MutationType } from 'pinia'
import { useI18n } from 'vue-i18n'
import useVisual from '@app/composables/useVisual'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import type WinPlayerTime from '@app/components/basic/WinPlayerTime.vue'
import { useSettingsStore } from '@app/stores/settingsStore'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { PlayerState } from '@app/types/types.ts'
import Hls from 'hls.js'

const { t } = useI18n()
const { startVisual, stopVisual } = useVisual()
const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerSongStore = usePlayerSongStore()
const playerPlaybackStore = usePlayerPlaybackStore()

const time = ref<InstanceType<typeof WinPlayerTime>>()
const canvas = ref<InstanceType<typeof HTMLCanvasElement>>()

const artwork = computed(() => {
  return playerSongStore.artwork_src ?? 'https://i.plaza.one/artwork_dead.jpg'
})

const playText = computed((): string => {
  if (playerPlaybackStore.state === PlayerState.LOADING) {
    return t('loading')
  } else if (playerPlaybackStore.state === PlayerState.PLAYING) {
    return t('win.player.btn_stop')
  } else {
    return t('win.player.btn_play')
  }
})

const isPlaying = computed(() => playerPlaybackStore.state === PlayerState.PLAYING)
const timerColor = computed(() => playerPlaybackStore.sleepTime !== 0 ? '#3455DB' : '')

// Non-reactive
//let offline = false
let volume = 100
let hls = new Hls()
let audio: HTMLAudioElement | null = null

function updateSong (): void {
  // if (offline && playerPlaybackStore.state === PlayerState.PLAYING) {
  //   stopPlay()
  //   setTimeout(play, 2000)
  // }

  if (playerPlaybackStore.state === PlayerState.PLAYING) {
    document.title = `${playerSongStore.artist} - ${playerSongStore.title}`
    updateMediaSession()
    updateMediaSessionPosition()
  }

  //offline = false
}

function play (): void {
  if (playerPlaybackStore.state === PlayerState.IDLE) {
    playerPlaybackStore.state = PlayerState.LOADING
    startPlay()
  } else {
    stopPlay()
  }
}

function startPlay (): void {
  audio = document.createElement('audio')
  audio.crossOrigin = 'anonymous'

  if (Hls.isSupported()) {
    hls.loadSource('https://radio.plaza.one/hls')
    hls.attachMedia(audio)
    if (settingsStore.lowQuality) {
      hls.currentLevel = 0
    }
  } else {
    const noCacheStr = 'nocache=' + Date.now()
    if (settingsStore.lowQuality) {
      audio.src = 'https://radio.plaza.one/mp3_low?' + noCacheStr
    } else {
      audio.src = 'https://radio.plaza.one/mp3?' + noCacheStr
    }
  }

  audio.volume = volume

  audio.addEventListener('play', onAudioPlayEvent)
  audio.addEventListener('pause', onAudioPauseEvent)

  audio.play().then(() => {
    playerPlaybackStore.state = PlayerState.PLAYING
    startVisual(audio!, canvas.value!)
    updateMediaSession()
    updateMediaSessionPosition()
  })

  document.title = `${playerSongStore.artist} - ${playerSongStore.title}`
}

function pausePlay(): void {
  stopPlay()
}

function stopPlay (): void {
  setMediaSessionState('none')
  stopVisual()

  if (Hls.isSupported()) {
    hls.detachMedia()
  }

  audio?.removeEventListener('play', onAudioPlayEvent)
  audio?.removeEventListener('pause', onAudioPauseEvent)
  audio?.pause()
  audio?.remove()
  audio = null

  playerPlaybackStore.state = PlayerState.IDLE
  playerPlaybackStore.sleepTime = 0

  document.title = 'Nightwave Plaza - Online Vaporwave Radio'
}

function onAudioPlayEvent() {
  setMediaSessionState('playing')
}

function onAudioPauseEvent() {
  setMediaSessionState('paused')
}

function setVolume (volume: number): void {
  updateVolume(volume)
  time.value!.showText(t('win.player.volume', { volume }))
}

function updateVolume (newVolume: number): void {
  volume = newVolume / 100
  if (playerPlaybackStore.state === PlayerState.PLAYING) {
    audio!.volume = volume
  }
}

function showSongInfo (): void {
  if (playerSongStore.songId) {
    windowsStore.showSong(playerSongStore.songId)
  }
}

function openUserWindow (): void {
  if (userAuthStore.signed) {
    windowsStore.open('user')
  } else {
    windowsStore.open('user-login')
  }
}

function openTimerWindow (): void {
  windowsStore.open('player-timer')
}

onMounted(() => {
  playerSongStore.$subscribe((mutation) => {
    if (mutation.type === MutationType.patchObject) {
      updateSong()
    }
  })

  setMediaSessionActions()
})

function updateMediaSession (): void {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playerSongStore.title,
      artist: playerSongStore.artist,
      album: playerSongStore.album,
      artwork: [
        { src: playerSongStore.artwork_src, sizes: '500x500', type: 'image/jpg' },
      ],
    })
  } else {
    console.log('No media session')
  }
}

function setMediaSessionActions (): void {
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', play)
      navigator.mediaSession.setActionHandler('pause', pausePlay)
    } catch (e) {
      console.log(e)
    }
  }
}

function setMediaSessionState (state: MediaSessionPlaybackState): void {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = state
  }
}

function updateMediaSessionPosition () {
  if ('setPositionState' in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: playerSongStore.length,
      position: playerSongStore.position
    });
  }
}
</script>

