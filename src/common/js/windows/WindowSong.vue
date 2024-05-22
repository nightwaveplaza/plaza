<template>
  <win-window :width="360" :name="name" :title="t('win.song.title')" v-slot="winProps">
    <div class="p-2 song-info">
      <div v-if="song.id !== ''">
        <div class="group-box m-0">
          <div class="gb-content p-2">
            <div class="row mt-0">
              <div class="col">
                <div class="mb-1">
                  <div class="noselect"><strong>{{ t('win.song.artist') }}:</strong><br/></div>
                  {{ song.artist }}
                </div>
                <div class="mb-1">
                  <div class="noselect"><strong>{{ t('win.song.album') }}:</strong><br/></div>
                  {{ song.album }}
                </div>
                <div class="mb-2">
                  <div class="noselect"><strong>{{ t('win.song.song_title') }}:</strong><br/></div>
                  {{ song.title }}
                </div>
                <div>
                  <i class="i icon-clock"/> {{ songLength }} &nbsp;
                  <i class="i icon-like" style="color: #c12727"/> {{ song.likes }}
                </div>
              </div>
              <div class="col-5">
                <img :src="artwork" alt="artwork" class="artwork simple-border">
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-4 pr-1">
            <audio ref="audio" :src="song.preview_src" @pause="onPause" @play="onPlay" @timeupdate="timeUpdated"/>
            <win-btn block :disabled="song.preview_src === null" @click="play">{{ playText }}</win-btn>
          </div>
          <div class="col-2 pl-0">
            <win-btn block @click="favoriteSong" :disabled="sending"><i class="icon-favorite i" :style="{color: favoriteColor }"/></win-btn>
          </div>
          <div class="col-auto ml-auto">
            <win-btn class="px-4" @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
          </div>
        </div>
      </div>
      <div v-else class="text-center">{{ t('loading') }}</div>
    </div>

    <div v-if="song" class="statusbar row no-gutters noselect">
      <div v-if="song.first_played_at" class="col cell">{{ t('win.song.first_played') }}: {{ sdy(song.first_played_at) }}</div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { api } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import { prefs } from '@common/js/extras/prefs'
import type { SongResponse } from '@common/js/types'

const { t } = useI18n()
const windowsStore = useWindowsStore()
const { dur, sdy } = helperComposable()

const props = defineProps<{
  id: string,
  name: string,
}>()

const audio = ref<HTMLAudioElement>()
const win = ref<InstanceType<typeof WinWindow>>()
const song: SongResponse = reactive({
  id: ''
})

const isPlaying = ref(false)
const sending = ref(false)
const playTimeLeft = ref(0)
const songLength = computed(() => dur(song.length!))
const artwork = computed(() => song.artwork_sm_src ?? 'https://i.plaza.one/dead.jpg')
const favoriteColor = computed(() => song.favorite_id ? '#FFD300' : '')
const playText = computed(() => isPlaying.value
    ? t('win.song.btn_stop', {time: dur(playTimeLeft.value)})
    : t('win.song.btn_play_preview')
)

function fetchSongInfo (songId: string) {
  api.songs.get(songId).then(res => {
    Object.assign(song, res.data)
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
    win.value!.close()
  })
}

async function favoriteSong () {
  sending.value = true

  try {
    if (song.favorite_id) {
      await api.user.deleteFavorite(song.favorite_id)
      song.favorite_id = undefined
    } else {
      const res = await api.user.addFavorite(song.id)
      song.favorite_id = res.data.favorite_id
    }
  } catch(e) {
    if (e instanceof AxiosError && e.response!.status === 401) {
      windowsStore.alert(t('errors.please_sign'), t('errors.error'))
    }
  } finally {
    sending.value = false
  }
}

function getVolume () {
  const volume = prefs.get<number>('volume', 100)
  return volume / 100
}

function play () {
  if (isPlaying.value) {
    stop()
  } else {
    audio.value!.volume = getVolume()
    audio.value!.play()
  }
}

function stop () {
  isPlaying.value = false
  audio.value!.pause()
  audio.value!.currentTime = 0
}

function onPlay () {
  isPlaying.value = true
}

function onPause () {
  isPlaying.value = false
}

function timeUpdated () {
  if (isPlaying.value) {
    playTimeLeft.value = 30 - audio.value!.currentTime
  }
}

onMounted(() => {
  fetchSongInfo(props.id)
})

onBeforeUnmount(() => {
  if (isPlaying.value) {
    stop()
    audio.value = undefined
  }
})

</script>
