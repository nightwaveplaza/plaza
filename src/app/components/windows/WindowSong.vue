<template>
  <win-window v-slot="winProps" :width="360" :name="name" :title="t('win.song.title')">
    <div class="p-2 song-info">
      <div v-if="song">
        <win-panel>
          <div class="row mt-0">
            <div class="col">
              <div class="mb-1">
                <div class="noselect">
                  <strong>{{ t('win.song.artist') }}:</strong><br>
                </div>
                {{ song.data.artist }}
              </div>
              <div class="mb-1">
                <div class="noselect">
                  <strong>{{ t('win.song.album') }}:</strong><br>
                </div>
                {{ song.data.album }}
              </div>
              <div class="mb-2">
                <div class="noselect">
                  <strong>{{ t('win.song.song_title') }}:</strong><br>
                </div>
                {{ song.data.title }}
              </div>
              <div>
                <i class="i icon-clock" /> {{ songLength }} &nbsp;
                <i class="i icon-like" style="color: #c12727" /> {{ song.stats.likes }}
              </div>
            </div>
            <div class="col-5">
              <img :src="artwork" alt="artwork" class="artwork simple-border">
            </div>
          </div>
        </win-panel>

        <div class="row mt-2">
          <div class="col-4 pr-1">
            <audio ref="audio" :src="song.data.preview_src" @pause="onPause" @play="onPlay" @timeupdate="timeUpdated" />
            <win-button block :disabled="song.data.preview_src === null" @click="play">
              {{ playText }}
            </win-button>
          </div>
          <div class="col-2 pl-0">
            <win-button block :disabled="sending" @click="favoriteSong">
              <i class="icon-favorite i" :style="{color: favoriteColor }" />
            </win-button>
          </div>
          <div class="col-auto ml-auto">
            <win-button class="px-4" @click="winProps.close()">
              {{ t('buttons.close') }}
            </win-button>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        {{ t('loading') }}
      </div>
    </div>

    <div v-if="song" class="statusbar row no-gutters noselect">
      <div v-if="song.stats.first_played_at" class="col cell">
        {{ t('win.song.first_played') }}: {{ fmtDate(song.stats.first_played_at) }}
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useWindowsStore } from '@app/stores/windowsStore'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { prefs } from '@app/utils/prefs.ts'
import type { SongWindowParams } from '@app/types/types'
import { useWindows } from '@app/composables/useWindows.ts'
import { fmtDate, fmtDuration } from '@app/utils/timeFormats.ts'
import { useSongsApi } from '@app/composables/api'
import { useUserFavoritesApi } from '@app/composables/api/useUserFavoritesApi.ts'

const { t } = useI18n()
const windowsStore = useWindowsStore()
const { winAlert } = useWindows()
const { addFavorite, deleteFavorite } = useUserFavoritesApi()


const props = defineProps<{
  name: string,
}>()

const songWindowParams: SongWindowParams = reactive({
  songId: ''
})

onBeforeMount(() => {
  const currentProps = windowsStore.windows[props.name]?.params as SongWindowParams
  if (currentProps) {
    songWindowParams.songId = currentProps.songId
  }
})

const audio = ref<HTMLAudioElement>()

const isPlaying = ref(false)
const sending = ref(false)
const playTimeLeft = ref(0)
const songLength = computed(() => fmtDuration(song.value?.data.length ?? 0))
const artwork = computed(() => song.value?.data.artwork_src)
const favoriteColor = computed(() => song.value?.current_user?.favorite_id ? '#FFD300' : '')
const playText = computed(() => isPlaying.value
    ? t('win.song.btn_stop', { time: fmtDuration(playTimeLeft.value) })
    : t('win.song.btn_play_preview')
)

const { getSong } = useSongsApi()
const { fetch, data: song, error } = getSong()

async function fetchSong() {
  await fetch(songWindowParams.songId)
}

async function favoriteSong (): Promise<void> {
  sending.value = true

  try {
    if (song.value?.current_user?.favorite_id) {
      await deleteFavorite().fetch(song.value.current_user.favorite_id)
    } else {
      await addFavorite().fetch(song.value!.data.id)
    }
    await fetchSong()
  } catch (e) {
    if (e instanceof AxiosError && e.response!.status === 401) {
      winAlert(t('errors.please_sign'), t('errors.error'))
    }
  } finally {
    sending.value = false
  }
}

function getVolume (): number {
  const volume = prefs.get<number>('volume', 100)
  return volume / 100
}

function play (): void {
  if (isPlaying.value) {
    stop()
  } else {
    audio.value!.volume = getVolume()
    audio.value!.play()
  }
}

function stop (): void {
  isPlaying.value = false
  audio.value!.pause()
  audio.value!.currentTime = 0
}

function onPlay (): void {
  isPlaying.value = true
}

function onPause (): void {
  isPlaying.value = false
}

function timeUpdated (): void {
  if (isPlaying.value) {
    playTimeLeft.value = 30 - audio.value!.currentTime
  }
}

watch(() => error.value, (error) => {
  if (error) winAlert(error.message, t('errors.error'))
})

onMounted(() => {
  fetchSong()
})

onBeforeUnmount(() => {
  if (isPlaying.value) {
    stop()
    audio.value = undefined
  }
})
</script>

<style lang="scss">
.song-info {
  .artwork {
    display: block;
    width: 100%;
    max-width: 146px;
    height: auto;
  }

  .group-box {
    line-height: 14px;
  }
}
</style>
