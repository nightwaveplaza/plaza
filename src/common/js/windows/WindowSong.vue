<template>
  <win-window :width="360" :name="name" title="Song Info" v-slot="winProps">
    <div class="p-2 song-info">
      <div v-if="song !== false">
        <div class="group-box p-2 m-0">
          <div class="row">
            <div class="col">
              <div class="mb-1">
                <div class="noselect"><strong>Artist:</strong><br/></div>
                {{ song.artist }}
              </div>
              <div class="mb-1">
                <div class="noselect"><strong>Album:</strong><br/></div>
                {{ song.album }}
              </div>
              <div class="mb-2">
                <div class="noselect"><strong>Title:</strong><br/></div>
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

        <div class="row mt-2">
          <div class="col-4 pr-1">
            <audio ref="audio" :src="song.preview_src" @pause="onPause" @play="onPlay" @timeupdate="timeUpdated"/>
            <win-btn block :disabled="song.preview_src === null" @click="play">{{ playText }}</win-btn>
          </div>
          <div class="col-2 pl-0">
            <win-btn block @click="favoriteSong"><i class="icon-favorite i" :style="{color: favoriteColor }"/></win-btn>
          </div>
          <div class="col-auto ml-auto">
            <win-btn class="px-4" @click="winProps.close()">Close</win-btn>
          </div>
        </div>
      </div>
      <div v-else class="text-center">Loading...</div>
    </div>

    <div v-if="song" class="statusbar row no-gutters noselect">
      <div v-if="song.first_played_at" class="col cell">First played: {{ sdy(song.first_played_at) }}</div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { songs, user } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import { prefs } from '@common/js/extras/prefs'

const windowsStore = useWindowsStore()

// Props
const props = defineProps<{
  id: string,
  name: string,
}>()

// Composable
const { dur, sdy } = helperComposable()

// Reactive data
const win = ref<InstanceType<typeof WinWindow>>()
const song = ref(false)
const isPlaying = ref(false)
const playTimeLeft = ref(0)
const songLength = computed(() => dur(song.value.length))
const playText = computed(() => isPlaying.value ? 'Stop (' + dur(playTimeLeft.value) + ')' : 'Play preview')
const artwork = computed(() => song.value.artwork_sm_src ?? 'https://i.plaza.one/dead.jpg')
const favoriteColor = computed(() => song.value.favorite_id ? '#FFD300' : '')

// Refs
const audio = ref(null)

// Non-reactive
let sending = false

// Functions
function fetchSongInfo (songId) {
  songs.get(songId).then(result => {
    song.value = result.data
  }).catch(error => {
    windowsStore.alert(error.response.data.error, 'Error')
    win.value.close()
  })
}

function favoriteSong () {
  if (sending) return

  sending = true

  if (song.value.favorite_id) {
    user.deleteFavorite(song.value.favorite_id).then(() => {
      song.value.favorite_id = null
    }).catch(err => showError(err)).finally(() => sending = false)
  } else {
    user.addFavorite(song.value.id).then((res) => {
      song.value.favorite_id = res.data.favorite_id
    }).catch(err => showError(err)).finally(() => sending = false)
  }
}

function showError (error) {
  if (error.response.status === 401) {
    windowsStore.alert('Please sign in to your Nightwave Plaza account to use the like button.', 'Error')
  }
}

function getVolume () {
  const volume = prefs.getInt('volume', 100)
  return volume / 100
}

function play () {
  if (isPlaying.value) {
    stop()
  } else {
    audio.value.volume = getVolume()
    audio.value.play()
  }
}

function stop () {
  isPlaying.value = false
  audio.value.pause()
  audio.value.currentTime = 0
}

function onPlay () {
  isPlaying.value = true
}

function onPause () {
  isPlaying.value = false
}

function timeUpdated () {
  if (isPlaying.value) {
    playTimeLeft.value = 30 - audio.value.currentTime
  }
}

onMounted(() => {
  fetchSongInfo(props.id)
})

onBeforeUnmount(() => {
  if (isPlaying.value) {
    stop()
    audio.value = null
  }
})

</script>
