<template>
  <div class="p-2 song-info">
    <div v-if="song">
      <win-panel>
        <div class="row mt-0">
          <div class="col">
            <div class="mb-1">
              <div class="noselect">
                <strong>{{ t('win.song.artist') }}:</strong><br />
              </div>
              {{ song.data.artist }}
            </div>
            <div class="mb-1">
              <div class="noselect">
                <strong>{{ t('win.song.album') }}:</strong><br />
              </div>
              {{ song.data.album }}
            </div>
            <div class="mb-2">
              <div class="noselect">
                <strong>{{ t('win.song.song_title') }}:</strong><br />
              </div>
              {{ song.data.title }}
            </div>
            <div>
              <i class="i icon-clock" /> {{ songLength }} &nbsp;
              <i class="i icon-like" style="color: #c12727" /> {{ song.stats.likes }}
            </div>
          </div>
          <div class="col-5 align-self-center">
            <div
              class="artwork simple-border ratio ratio-1x1"
              :style="{ 'background-image': `url('${artwork}')` }"
            />
          </div>
        </div>
      </win-panel>

      <div class="row mt-2">
        <div class="col-4 pe-1">
          <audio
            ref="audio"
            :src="song.data.preview_src"
            @pause="onPause"
            @play="onPlay"
            @timeupdate="timeUpdated"
          />
          <win-button class="d-block" :disabled="song.data.preview_src === null" @click="play">
            {{ playText }}
          </win-button>
        </div>
        <div class="col-2 ps-0">
          <win-button class="d-block" :disabled="sending" @click="favoriteSong">
            <i class="icon-favorite i" :style="{ color: favoriteColor }" />
          </win-button>
        </div>
        <div class="col-auto ms-auto">
          <win-button class="px-4" @click="closeWindow(winId!)">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      {{ t('loading') }}
    </div>
  </div>

  <div v-if="song" class="statusbar row gx-0 noselect">
    <div v-if="song.stats.first_played_at" class="col cell">
      {{ t('win.song.first_played') }}: {{ fmtDate(song.stats.first_played_at) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, type Ref, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { SongWindowParams } from '@app/types/types';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { fmtDate, fmtDuration } from '@app/utils/timeFormats.ts';
  import { useVolumeControl } from '@app/composables/player/useVolumeControl.ts';
  import { useApi } from '@app/composables/useApi.ts';
  import { songApi } from '@app/api/songs.api.ts';
  import { userFavoritesApi } from '@app/api/userFavorites.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { showAlert } = useWindows();
  const { execute: addFavorite } = useApi(userFavoritesApi.addFavorite);
  const { execute: deleteFavorite } = useApi(userFavoritesApi.deleteFavorite);
  const { openedWindows, closeWindow } = useWindows();

  const winId: Ref<string> | undefined = inject('windowId');

  const params = computed(() => openedWindows.value[winId!.value]?.params as SongWindowParams);

  const audio = ref<HTMLAudioElement>();

  const isPlaying = ref(false);
  const sending = ref(false);
  const playTimeLeft = ref(0);
  const songLength = computed(() => fmtDuration(song.value?.data.length ?? 0));
  const artwork = computed(() => song.value?.data.artwork_src);
  const favoriteColor = computed(() => (song.value?.current_user?.favorite_id ? '#FFD300' : ''));
  const playText = computed(() =>
    isPlaying.value
      ? t('win.song.btn_stop', { time: fmtDuration(playTimeLeft.value) })
      : t('win.song.btn_play_preview'),
  );

  const { execute: getSong, data: song } = useApi(songApi.getSong);
  const { volume } = useVolumeControl();

  async function fetchSong(): Promise<void> {
    try {
      await getSong(params.value.songId);
    } catch (e) {
      showAlert((e as ApiError).message, t('errors.error'));
      closeWindow(winId!.value);
    }
  }

  async function favoriteSong(): Promise<void> {
    sending.value = true;

    try {
      if (song.value?.current_user?.favorite_id) {
        await deleteFavorite({ id: song.value.current_user.favorite_id });
      } else {
        await addFavorite({ song_id: song.value!.data.id });
      }
      await fetchSong();
    } catch (e) {
      if ((e as ApiError).code === 401) {
        showAlert(t('errors.please_sign'), t('errors.error'));
      }
    } finally {
      sending.value = false;
    }
  }

  function getVolume(): number {
    return volume.value / 100;
  }

  function play(): void {
    if (isPlaying.value) {
      stop();
    } else {
      audio.value!.volume = getVolume();
      audio.value!.play();
    }
  }

  function stop(): void {
    isPlaying.value = false;
    audio.value!.pause();
    audio.value!.currentTime = 0;
  }

  function onPlay(): void {
    isPlaying.value = true;
  }

  function onPause(): void {
    isPlaying.value = false;
  }

  function timeUpdated(): void {
    if (isPlaying.value) {
      playTimeLeft.value = 30 - audio.value!.currentTime;
    }
  }

  onMounted(() => {
    fetchSong();
  });

  onBeforeUnmount(() => {
    if (isPlaying.value) {
      stop();
      audio.value = undefined;
    }
  });
</script>

<style lang="scss">
  .song-info {
    .artwork {
      width: 100%;
      height: auto;
      background-size: cover;
    }

    .group-box {
      line-height: 14px;
    }
  }
</style>
