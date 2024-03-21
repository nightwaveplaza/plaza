<template/>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { status } from '@common/js/api/api'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'

const OSD_UPDATE_INTERVAL = 10000
const store = useStore()
const playerPlaybackStore = usePlayerPlaybackStore()

// Vars
let statusUpdatedAt = 0
let osdUpdatedAt = 0
let updating = false

function tick () {
  const now = Date.now()
  const actualPosition = playerPlaybackStore.position + Math.floor(((now - statusUpdatedAt) / 1000))

  if (!playerPlaybackStore.songId || playerPlaybackStore.length - actualPosition < 3) {
    updateStatus()
  } else if (now - osdUpdatedAt > OSD_UPDATE_INTERVAL) {
    updateOsd()
  } else {
    setTimeout(tick, 1000)
  }
}

// Update on-screen-data (listeners, reactions)
function updateOsd () {
  if (updating) return
  updating = true

  status.getOsd().then(res => {
    // store.commit('player/listeners', res.data[1])
    // store.commit('player/reactions', res.data[2])
    playerPlaybackStore.listeners = res.data[1]
    playerPlaybackStore.reactions = res.data[2]
  }).catch(err => {
    console.log(`Failed to update status: ${err}`)
  }).finally(() => {
    updating = false
    osdUpdatedAt = Date.now()
    setTimeout(tick, 1000)
  })
}

// Update current song status
function updateStatus () {
  if (updating) return
  updating = true

  status.get().then((res) => {
    playerPlaybackStore.$patch({
        songId: res.data.song.id,
        artist: res.data.song.artist,
        title: res.data.song.title,
        album: res.data.song.album,
        position: res.data.song.position,
        length: res.data.song.length,
        reactions: res.data.song.reactions,
        listeners: res.data.listeners,
        artwork_src: res.data.song.artwork_src,
        artwork_sm_src: res.data.song.artwork_sm_src,
      },
    )
  }).catch((err) => {
    console.log(`Failed to update status: ${err}`)
  }).finally(() => {
    updating = false
    osdUpdatedAt = Date.now()
    statusUpdatedAt = Date.now()
    setTimeout(tick, 1000)
  })
}

onMounted(() => {
  tick()
})

</script>
