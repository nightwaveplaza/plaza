<template/>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { status } from '@common/js/api/api'

const OSD_UPDATE_INTERVAL = 10000
const store = useStore()

// Reactive data
const currentSong = computed(() => store.getters['player/currentSong'])

// Vars
let statusUpdatedAt = 0
let osdUpdatedAt = 0
let updating = false

function tick () {
  const now = Date.now()
  const actualPosition = currentSong.value.position + Math.floor(((now - statusUpdatedAt) / 1000))

  if (!currentSong.value.id || currentSong.value.length - actualPosition < 3) {
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
    store.commit('player/listeners', res.data[1])
    store.commit('player/reactions', res.data[2])
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
    store.commit('player/currentSong', res.data.song)
    store.commit('player/listeners', res.data.listeners)
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
