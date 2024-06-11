<template>
  <div class="player-time">
    {{ display }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { MutationType } from 'pinia'
import { useI18n } from 'vue-i18n'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'
import helperComposable from '@app/composables/helperComposable'

const CLOCK_REFRESH = 1000

const { t } = useI18n()
const playerSongStore = usePlayerSongStore()
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

function showText (newText: string): void {
  text.value = newText
  textTime.value = 2000
}

function tick (): void {
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
  showText(t('win.player.welcome'))
  intervalId = window.setInterval(tick, CLOCK_REFRESH)

  playerSongStore.$subscribe((mutation, state) => {
    if (mutation.type === MutationType.patchObject) {
      length.value = state.length
      position = state.position
      songUpdatedAt = Date.now()
    }
  })
})

onUnmounted(() => {
  window.clearInterval(intervalId)
})

defineExpose({
  showText
})

</script>
