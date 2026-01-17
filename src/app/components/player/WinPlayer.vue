<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0 px-4 px-sm-0">
      <div class="cover simple-border noselect embed-responsive embed-responsive-1by1"
           :style="{'background-image': `url('${artwork}')`}"
           @click="showSongInfo"
      />
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">
          {{ song.artist }}
        </div>
        <div class="player-title track-title">
          {{ song.title }}
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
                <win-button block @click="openWindow(Win.SETTINGS)">
                  <i class="i icon-cog mr-0" />
                </win-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type WinPlayerTime from '@app/components/player/WinPlayerTime.vue'
import { PlayerState } from '@app/types/types.ts'
import { useVolumeControl } from '@app/composables/player/useVolumeControl.ts'
import { useAudioPlayer } from '@app/composables/player/useAudioPlayer.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'
import { usePlayerPlayback } from '@app/composables/player/usePlayerPlayback.ts'

const { volume, setVolume } = useVolumeControl()
const { playAudio, stopAudio, setVisualCanvas } = useAudioPlayer()
const { song } = useNowPlayingStatus()

const { t } = useI18n()
const { openWindow, winSongInfo } = useWindows()
const { isSigned } = useAuth()
const { state, setState, sleepTime } = usePlayerPlayback()

const time = ref<InstanceType<typeof WinPlayerTime>>()
const canvas = ref<InstanceType<typeof HTMLCanvasElement>>()

const artwork = computed(() => {
  return song.artwork_src ?? 'https://i.plaza.one/artwork_dead.jpg'
})

const playText = computed((): string => {
  switch (state.value) {
    case PlayerState.LOADING: return t('loading')
    case PlayerState.PLAYING: return t('win.player.btn_stop')
    default: return t('win.player.btn_play')
  }
})

const isPlaying = computed(() => state.value === PlayerState.PLAYING)
const timerColor = computed(() => sleepTime.value > 0 ? '#3455DB' : '')

watch(volume, (newVolume) => {
  time.value!.showText(t('win.player.volume', { volume: newVolume }))
})

function play (): void {
  if (state.value === PlayerState.IDLE) {
    setState(PlayerState.LOADING)
    playAudio()
  } else {
    stopAudio()
  }
}

function showSongInfo (): void {
  if (song.id) {
    winSongInfo(song.id)
  }
}

function openUserWindow (): void {
  openWindow(isSigned.value ? Win.USER : Win.USER_LOGIN)
}

function openTimerWindow (): void {
  openWindow(Win.PLAYER_TIMER)
}

onMounted(() => {
  setVisualCanvas(canvas.value!)
})
</script>

