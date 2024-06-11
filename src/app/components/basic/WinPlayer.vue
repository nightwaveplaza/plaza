<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0 px-4 px-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork" @click="showSongInfo">
      </div>
      <audio ref="audio" crossorigin="anonymous" preload="auto" @loadedmetadata="audioCanPlay" />
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
              <win-player-time ref="time" />
            </div>
          </div>

          <div class="col col-md-5 d-none d-md-block">
            <win-player-volume @onchange="setVolume" @onload="updateVolume" />
          </div>
        </div>

        <div class="row no-gutters">
          <div class="col-7 col-md-7 pr-md-2">
            <div class="row no-gutters">
              <div class="col-7 col-md-8">
                <win-button class="player-play" block @click="play()">
                  {{ playText }}
                </win-button>
              </div>
              <div class="col-5 col-md-4">
                <win-player-reactions />
              </div>
            </div>
          </div>
          <div class="col-5 col-md-5">
            <div class="row no-gutters">
              <div class="col-6">
                <win-button block @click="openUserWindow()">
                  <i class="i icon-user mr-0" />
                </win-button>
              </div>
              <div class="col-6">
                <win-button block @click="windowsStore.open('settings-background')">
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

// const
const STATE_IDLE = 0
const STATE_LOADING = 1
const STATE_PLAYING = 2

const { t } = useI18n()
const { startVisual, stopVisual } = useVisual()
const settingsStore = useSettingsStore()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerSongStore = usePlayerSongStore()

const audio = ref<InstanceType<typeof HTMLAudioElement>>()
const time = ref<InstanceType<typeof WinPlayerTime>>()
const canvas = ref<InstanceType<typeof HTMLCanvasElement>>()
const state = ref(STATE_IDLE)

const artwork = computed(() => {
  if (playerSongStore.songId && playerSongStore.artwork_src) {return playerSongStore.artwork_src}
  else {return 'https://i.plaza.one/artwork_dead.jpg'}
})
const playText = computed(() => {
  if (state.value === STATE_IDLE) {return t('win.player.btn_play')}
  else if (state.value === STATE_LOADING) {return t('loading')}
  else {return t('win.player.btn_stop')}
})

// Non-reactive
let offline = false
let volume = 100

function updateSong (): void {
  if (offline && state.value === STATE_PLAYING) {
    stopPlay()
    setTimeout(play, 2000)
  }

  if (state.value === STATE_PLAYING) {
    document.title = `${playerSongStore.artist} - ${playerSongStore.title}`
    updateMediaSession()
  }

  offline = false
}

function play (): void {
  if (state.value === STATE_IDLE) {
    state.value = STATE_LOADING
    startPlay()
  } else {
    stopPlay()
  }
}

function startPlay (): void {
  const noCacheStr = 'nocache=' + Date.now()
  // audio.value!.type = 'audio/mpeg' TODO: why
  if (settingsStore.lowQuality) {
    audio.value!.src = 'https://radio.plaza.one/mp3_low?' + noCacheStr
  } else {
    audio.value!.src = 'https://radio.plaza.one/mp3?' + noCacheStr
  }

  audio.value!.load()
  audio.value!.volume = volume

  document.title = `${playerSongStore.artist} - ${playerSongStore.title}`
}

function audioCanPlay (): void {
  if (state.value === STATE_LOADING) {
    state.value = STATE_PLAYING

    audio.value!.play().then(() => {
      startVisual(audio.value!, canvas.value!)
      updateMediaSession()
      setMediaSessionState('playing')
    }).catch(e => console.log(e))
  }
}

function stopPlay (): void {
  audio.value!.pause()
  audio.value!.currentTime = 0
  stopVisual()

  state.value = STATE_IDLE
  setMediaSessionState('paused')
  document.title = 'Nightwave Plaza - Online Vaporwave Radio'
}

function setVolume (volume: number): void {
  updateVolume(volume)
  time.value!.showText(t('win.player.volume', {volume}))
}

function updateVolume (newVolume: number): void {
  volume = newVolume / 100
  if (state.value === STATE_PLAYING) {
    audio.value!.volume = volume
  }
}

function showSongInfo (): void {
  if (playerSongStore.songId) {
    windowsStore.showSong(playerSongStore.songId)
  }
}

function updateMediaSession (): void {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playerSongStore.title,
      artist: playerSongStore.artist,
      album: playerSongStore.album,
      artwork: [
        { src: playerSongStore.artwork_sm_src, sizes: '300x300', type: 'image/jpg' },
        { src: playerSongStore.artwork_src, sizes: '500x500', type: 'image/jpg' },
      ],
    })
  } else {
    console.log('No media session')
  }
}

function setMediaSessionActions (): void {
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

function setMediaSessionState (state: string): void {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = state as MediaSessionPlaybackState
  }
}

function openUserWindow(): void {
  if (userAuthStore.signed) {
    windowsStore.open('user')
  } else {
    windowsStore.open('user-login')
  }
}

onMounted(() => {
  playerSongStore.$subscribe((mutation) => {
    if (mutation.type === MutationType.patchObject) {
      updateSong()
    }
  })

  setMediaSessionActions()
})
</script>

<style lang="scss">
#window-player {
  .player-visual {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    position: absolute;
  }
}
</style>
