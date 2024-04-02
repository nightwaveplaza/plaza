<template>
  <div class="player-volume">
    <div class="player-volume-icon"/>
    <div class="player-volume-control">
      <div id="player-volume-range" ref="volumeSlider"></div>
    </div>
    <div class="player-volume-line simple-border"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import noUiSlider from 'nouislider'
import { prefs } from '@common/js/extras/prefs'

const emit = defineEmits(['onload', 'onchange'])

const volumeSlider = ref<HTMLDivElement | null>(null)

// Non-reactive
let volume = 0

function createSlider() {
  noUiSlider.create(volumeSlider.value!, {
    start: [volume],
    range: {
      'min': [0],
      'max': [100],
    },
  }).on('slide', (values, handle) => {
    volume = Math.round(values[0] as number)
    prefs.save('volume', volume)
    emit('onchange', volume)
  })
}

onMounted(() => {
  volume = prefs.getInt('volume', 100)
  createSlider()
  emit('onload', volume)
})
</script>
