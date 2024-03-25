<template>
  <div class="player-time">{{ display }}</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import helperComposable from '@common/js/composables/helperComposable'
import { MutationType } from 'pinia'

const CLOCK_REFRESH = 1000

const playerPlaybackStore = usePlayerPlaybackStore()

const { dur } = helperComposable()

const length = ref(0)
const actualPosition = ref(0)
const textTime = ref(0)
const text = ref('')
const display = computed(() => textTime.value > 0 ? text.value : clock.value)
const clock = computed(() => length.value > 0 ? dur(actualPosition.value) + ' / ' + dur(length.value) : '...')

// Non-reactive
let position = 0
let songUpdatedAt = 0
let intervalId = 0

function showText (newText: string) {
  text.value = newText
  textTime.value = 2000
}

function tick () {
  const now = Date.now()
  let correctedPosition = Math.floor((now - songUpdatedAt) / 1000) + position
  if (correctedPosition > length.value) {
    correctedPosition = length.value
  }

  if (songUpdatedAt) {
    actualPosition.value = correctedPosition
  }

  if (textTime.value > 0) {
    textTime.value -= CLOCK_REFRESH
  }
}

onMounted(() => {
  showText('Welcome back!')
  intervalId = setInterval(tick, CLOCK_REFRESH)

  playerPlaybackStore.$subscribe((mutation, state) => {
    if (mutation.type === MutationType.patchObject) {
      length.value = state.length
      position = state.position
      songUpdatedAt = Date.now()
    }
  })
})

defineExpose({
  showText
})

</script>
