<template>
  <div class="player-time">
    {{ display }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { useTimeFormats } from '@app/composables/useTimeFormats.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'

const CLOCK_REFRESH = 1000

const { t } = useI18n()
const playerPlayback = usePlayerPlaybackStore()
const { fmtDuration } = useTimeFormats()
const { song, updatedAt, position } = useNowPlayingStatus()

const emit = defineEmits(['stopByTimer'])

const actualPosition = ref(0)
const textTime = ref(0)
const text = ref('')
const display = computed(() => textTime.value > 0 ? text.value : clock.value)
const clock = computed(() => song.length > 0 ? fmtDuration(actualPosition.value) + ' / ' + fmtDuration(song.length) : '...')

let intervalId = 0

function showText (newText: string): void {
  text.value = newText
  textTime.value = 2000
}

function tick (): void {
  const now = Date.now()
  let correctedPosition = Math.floor((now - updatedAt.value) / 1000) + position.value

  if (correctedPosition > song.length) {
    correctedPosition = song.length
  }

  if (updatedAt.value) {
    actualPosition.value = correctedPosition
  }

  if (textTime.value > 0) {
    textTime.value -= CLOCK_REFRESH
  }

  checkSleepTimer()
}

function checkSleepTimer (): void {
  const t = playerPlayback.sleepTime

  if (t > 0 && t < Date.now()) {
    playerPlayback.sleepTime = 0
    emit('stopByTimer')
  }
}

onMounted(() => {
  showText(t('win.player.welcome'))
  intervalId = window.setInterval(tick, CLOCK_REFRESH)
})

onUnmounted(() => {
  window.clearInterval(intervalId)
})

defineExpose({
  showText
})
</script>
