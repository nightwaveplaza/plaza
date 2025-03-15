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
              <win-player-time ref="time" @stop-by-timer="stopAudio" />
            </div>
          </div>

          <div class="col col-md-5 d-none d-md-block">
            <win-player-volume :volume="volume" @update-volume="setVolume" />
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
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'
import { useUserAuthStore } from '@app/stores/userAuthStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import type WinPlayerTime from '@app/components/basic/WinPlayerTime.vue'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { PlayerState } from '@app/types/types.ts'
import { useVolumeControl } from '@app/composables/useVolumeControl.ts'
import { useAudioPlayer } from '@app/composables/useAudioPlayer.ts'
import { useAlerts } from '@app/composables/useAlerts.ts'

const { volume, setVolume } = useVolumeControl()
const { playAudio, stopAudio, setVisualCanvas } = useAudioPlayer()

const { t } = useI18n()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerSongStore = usePlayerSongStore()
const playerPlayback = usePlayerPlaybackStore()
const { winSongInfo } = useAlerts()

const time = ref<InstanceType<typeof WinPlayerTime>>()
const canvas = ref<InstanceType<typeof HTMLCanvasElement>>()

const artwork = computed(() => {
  return playerSongStore.artwork_src ?? 'https://i.plaza.one/artwork_dead.jpg'
})

const playText = computed((): string => {
  switch (playerPlayback.state) {
    case PlayerState.LOADING: return t('loading')
    case PlayerState.PLAYING: return t('win.player.btn_stop')
    default: return t('win.player.btn_play')
  }
})

const isPlaying = computed(() => playerPlayback.state === PlayerState.PLAYING)
const timerColor = computed(() => playerPlayback.sleepTime !== 0 ? '#3455DB' : '')

watch(volume, (newVolume) => {
  time.value!.showText(t('win.player.volume', { volume: newVolume }))
})

function play (): void {
  if (playerPlayback.state === PlayerState.IDLE) {
    playerPlayback.state = PlayerState.LOADING
    playAudio()
  } else {
    stopAudio()
  }
}

function showSongInfo (): void {
  if (playerSongStore.songId) {
    winSongInfo(playerSongStore.songId)
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
  setVisualCanvas(canvas.value!)
})
</script>

