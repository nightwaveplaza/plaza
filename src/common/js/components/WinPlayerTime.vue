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
let songUpdated = 0
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
  const correctedPosition = Math.floor((now - songUpdated) / 1000) + position

  if (songUpdated && length.value - actualPosition.value > 0) {
    actualPosition.value = correctedPosition
    //
    // if (this.position < this.length) {
    //   this.position += 1;
    // }
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
      position = state.player.song.position
      length.value = state.player.song.length
      songUpdated = Date.now()
    }
  })
})

defineExpose({
  showText
})

</script>
