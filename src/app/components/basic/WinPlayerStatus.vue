<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { api } from '@app/api/api'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'

const STATUS_UPDATE_INTERVAL = 10000
const playerSongStore = usePlayerSongStore()

let unmounted = false
let intervalId = 0

function updateStatus (): void {
  api.status.get().then((res) => {
    playerSongStore.$patch({
      songId: res.data.song.id,
      artist: res.data.song.artist,
      title: res.data.song.title,
      album: res.data.song.album,
      position: res.data.song.position,
      length: res.data.song.length,
      reactions: res.data.song.reactions,
      artwork_src: res.data.song.artwork_src,
      artwork_sm_src: res.data.song.artwork_sm_src,
      listeners: res.data.listeners,
    })
  }).catch(e => {
    console.log(`Failed to update status: ${(e as Error).message}`)
  })

  if (!unmounted) {
    intervalId = window.setTimeout(updateStatus, STATUS_UPDATE_INTERVAL)
  }
}

onMounted(() => {
  updateStatus()
})

onBeforeUnmount(() => {
  clearTimeout(intervalId)
  unmounted = true
})
</script>
