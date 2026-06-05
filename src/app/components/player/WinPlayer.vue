<template>
  <div class="row gx-0">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0">
      <div
        class="cover simple-border ratio ratio-1x1"
        :style="{ 'background-image': `url('${artwork}')` }"
        @click="openSongInfo"
      />
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta ps-sm-2 is-selectable">
        <div class="player-artist track-artist mb-2">
          {{ song.artist }}
        </div>
        <div class="player-title track-title">
          {{ song.title }}
        </div>

        <div class="row my-1 my-sm-2 py-1 gx-0">
          <div
            class="col-12 col-md-7 pe-0 pe-md-2"
            :class="{ 'col-md-7': !isMobile(), 'pe-md-2': !isMobile(), 'col-md-6': isMobile() }"
          >
            <div class="text-field p-0 m-0 player-time-container">
              <canvas v-if="!isMobile()" ref="canvas" class="player-visual" />
              <win-player-time ref="time" @stop-by-timer="stopAudio" />
            </div>
          </div>

          <div v-if="!isMobile()" class="col col-md-5 d-none d-md-block position-relative">
            <win-player-volume :volume="volume" @update-volume="setVolume" />
          </div>
        </div>

        <div class="row gx-1">
          <div class="col-8 col-md-7 pe-md-2">
            <div class="row gx-1">
              <div :class="{ 'col-8': !isPlaying, 'col-md-5': isPlaying, 'col-5': isPlaying }">
                <win-button class="d-block player-play" @click="play()">
                  {{ playText }}
                </win-button>
              </div>
              <div v-if="isPlaying" class="col-3">
                <win-button class="d-block" @click="openTimerWindow">
                  <i :style="{ color: timerColor }" class="i icon-clock" />
                </win-button>
              </div>
              <div class="col-4">
                <win-player-reactions />
              </div>
            </div>
          </div>

          <div class="col-4 col-md-5">
            <div class="row gx-1 d-none d-sm-flex">
              <div class="col-6">
                <win-button class="d-block" @click="openWindow(Win.USER)">
                  <i class="i icon-user me-0" />
                </win-button>
              </div>
              <div class="col-6">
                <win-button class="d-block" @click="openWindow(Win.SETTINGS)">
                  <i class="i icon-cog me-0" />
                </win-button>
              </div>
            </div>
            <win-start-button class="d-inline-flex w-100 d-sm-none" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type WinPlayerTime from '@app/components/player/WinPlayerTime.vue';
  import { PlayerState } from '@app/types/types.ts';
  import { useVolumeControl } from '@app/composables/player/useVolumeControl.ts';
  import { useAudioPlayer } from '@app/composables/player/useAudioPlayer.ts';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts';
  import { Win } from '@app/types';
  import { usePlayerPlayback } from '@app/composables/player/usePlayerPlayback.ts';
  import { isMobile } from '@app/utils/helpers.ts';
  import { useNativeAudioPlayer } from '@app/composables/useNativeAudioPlayer.ts';
  import { useSleepTimer } from '@app/composables/useSleepTimer.ts';

  const { volume } = useVolumeControl();
  const { playAudio, stopAudio, setVisualCanvas } = isMobile()
    ? useNativeAudioPlayer()
    : useAudioPlayer();
  const { song } = useNowPlayingStatus();

  const { t } = useI18n();
  const { openWindow, showSongInfo } = useWindows();
  const { state } = usePlayerPlayback();
  const { sleepTime } = useSleepTimer();

  const time = !isMobile() ? ref<InstanceType<typeof WinPlayerTime>>() : undefined;
  const canvas = !isMobile() ? ref<InstanceType<typeof HTMLCanvasElement>>() : undefined;

  const artwork = computed(() => {
    return song.artwork_src ?? 'https://i.plaza.one/artwork_dead.jpg';
  });

  const playText = computed((): string => {
    switch (state.value) {
      case PlayerState.LOADING:
        return t('loading');
      case PlayerState.PLAYING:
        return t('win.player.btn_stop');
      default:
        return t('win.player.btn_play');
    }
  });

  const isPlaying = computed(() => state.value === PlayerState.PLAYING);
  const timerColor = computed(() => (sleepTime.value > 0 ? '#3455DB' : ''));

  function setVolume(vol: number) {
    volume.value = vol;
  }

  function play(): void {
    if (state.value === PlayerState.IDLE) {
      state.value = PlayerState.LOADING;
      playAudio();
    } else {
      stopAudio();
    }
  }

  function openSongInfo(): void {
    if (song.id) {
      showSongInfo(song.id);
    }
  }

  function openTimerWindow(): void {
    openWindow(Win.PLAYER_TIMER);
  }

  onMounted(() => {
    if (!isMobile()) {
      setVisualCanvas(canvas!.value!);

      watch(volume, newVolume => {
        time!.value!.showText(t('win.player.volume', { volume: newVolume }));
      });
    }
  });
</script>
