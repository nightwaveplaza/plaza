<template/>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { api } from '@common/js/api/api'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'

const OSD_UPDATE_INTERVAL = 10000
const playerPlaybackStore = usePlayerPlaybackStore()

// Vars
let statusUpdatedAt = 0
let osdUpdatedAt = 0
let updating = false
let intervalId = 0

function tick () {
  const now = Date.now()
  const actualPosition = playerPlaybackStore.position + Math.floor(((now - statusUpdatedAt) / 1000))

  if (!playerPlaybackStore.songId || playerPlaybackStore.length - actualPosition < 3) {
    updateStatus()
  } else if (now - osdUpdatedAt > OSD_UPDATE_INTERVAL) {
    updateOsd()
  } else {
    intervalId = setTimeout(tick, 1000)
  }
}

// Update on-screen-data (listeners, reactions)
function updateOsd () {
  if (updating) return
  updating = true

  api.status.getOsd().then(res => {
    playerPlaybackStore.listeners = res.data[1] as number
    playerPlaybackStore.reactions = res.data[2] as number
  }).catch(e => {
    console.log(`Failed to update status: ${(e as Error).message}`)
  }).finally(() => {
    updating = false
    osdUpdatedAt = Date.now()
    intervalId = setTimeout(tick, 1000)
  })
}

// Update current song status
function updateStatus () {
  if (updating) return
  updating = true

  api.status.get().then(res => {
    playerPlaybackStore.$patch({
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
  }).finally(() => {
    updating = false
    osdUpdatedAt = Date.now()
    statusUpdatedAt = Date.now()
    intervalId = setTimeout(tick, 1000)
  })
}

onMounted(() => {
  tick()
})

onBeforeUnmount(() => {
  clearTimeout(intervalId)
})
</script>
