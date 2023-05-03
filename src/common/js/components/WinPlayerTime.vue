<template>
  <div class="player-time">{{ display }}</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import ticker from '@common/js/extras/ticker'
import helperComposable from '@common/js/composables/helperComposable'

const CLOCK_REFRESH = 300

const store = useStore()

// Composable
const { dur } = helperComposable()

// Refs
const length = ref(0)
const actualPosition = ref(0)
const textTime = ref(0)
const text = ref('')
const display = computed(() => textTime.value > 0 ? text.value : clock.value)
const clock = computed(() => length.value > 0 ? dur(actualPosition.value) + ' / ' + dur(length.value) : '...')

// Non-reactive
let position = 0
let songUpdatedAt = 0
let tickerId = 0

// Methods
function showText (newText) {
  text.value = newText
  textTime.value = 2000
}

function resetTimer () {
  ticker.stop(tickerId)
  tickerId = ticker.set(tick, CLOCK_REFRESH)
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
  tickerId = ticker.set(tick, CLOCK_REFRESH)

  store.subscribe((mutation, state) => {
    if (mutation.type === 'player/currentSong') {
      length.value = state.player.song.length
      position = state.player.song.position
      songUpdatedAt = Date.now()
    }
  })
})

defineExpose({
  showText
})

</script>
