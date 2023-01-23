<template>
  <div class="player-volume">
    <div class="player-volume-icon"/>
    <div class="player-volume-control">
      <div id="player-volume-range" ref="volumeSlider"></div>
    </div>
    <div class="player-volume-line simple-border"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import settings from '@common/js/extras/settings'
import noUiSlider from 'nouislider'

// Emits
const emit = defineEmits(['onload', 'onchange'])

// Refs
const volumeSlider = ref(null)

// Non-reactive
let volume = 0

onMounted(() => {
  volume = settings.load('volume')
  if (volume === null) {
    volume = 100
  }

  noUiSlider.create(volumeSlider.value, {
    start: [volume],
    range: {
      'min': [0],
      'max': [100],
    },
  })

  volumeSlider.value.noUiSlider.on('slide', (values, handle) => {
    volume = parseInt(values)
    settings.save('volume', volume)
    emit('onchange', volume)
  })

  emit('onload', volume)
})
</script>
