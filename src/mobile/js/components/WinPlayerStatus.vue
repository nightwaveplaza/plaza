<template/>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { status } from '@common/js/api/api'
import ticker from '@common/js/extras/ticker'
import { Native } from '@mobile/js/bridge/native'

const OSD_UPDATE_INTERVAL = 10000
const REQUEST_INTERVAL = 1000

const store = useStore()

// Reactive data
const currentSong = computed(() => store.getters['player/currentSong'])

// Non-reactive data
let statusUpdatedAt = 0
let requestSentAt = 0
let osdUpdatedAt = 0
let updating = false

function tick () {
  const now = Date.now()

  const actualPosition = currentSong.value.position + Math.floor(((now - statusUpdatedAt) / 1000))

  if (!currentSong.value.id || currentSong.value.length - actualPosition < 3) {
    requestUpdate()
  } else if (now - osdUpdatedAt > OSD_UPDATE_INTERVAL) {
    updateOsd()
  }
}

function requestUpdate () {
  const now = Date.now()
  if (now - requestSentAt >= REQUEST_INTERVAL) {
    requestSentAt = now
    Native.requestUiUpdate()
  }
}

function updateOsd () {
  if (updating) return
  updating = true

  status.getOsd().then(res => {
    if (res.data[0] !== currentSong.value.id) {
      requestUpdate()
    } else {
      store.commit('player/listeners', res.data[1])
      store.commit('player/reactions', res.data[2])
    }
  }).catch(err => console.log(`Failed to update status: ${err}`)).finally(() => {
    updating = false
    osdUpdatedAt = Date.now()
  })
}

function setStatus (status) {
  if (JSON.stringify(status) === '{}' || status.id === '') {
    return
  }

  // If song has been changed
  if (status.id !== currentSong.value.id) {
    store.commit('player/currentSong', status)
    store.commit('player/listeners', status.listeners)
    osdUpdatedAt = Date.now()
  }

  store.commit('isPlaying', status.isPlaying)
  store.commit('sleepTime', status.sleepTime)
  statusUpdatedAt = Date.now()
}

function setArtwork (artwork) {
  if (currentSong.value.id) {
    store.commit('player/artwork', artwork)
  }
}

onMounted(() => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'pushData') {

      if (mutation.payload.name === 'status') {
        setStatus(state.data['status'])
      }

      if (mutation.payload.name === 'artwork') {
        setArtwork(state.data['artwork'])
      }

      if (mutation.payload.name === 'reactionUpdate') {
        store.commit('player/reaction', state.data['reactionUpdate'].score)
        updateOsd()
      }
    }
  })

  setInt(tick, 1000)
})
</script>
