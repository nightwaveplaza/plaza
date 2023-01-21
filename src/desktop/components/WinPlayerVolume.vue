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
import settings from '@common/extras/settings'
import noUiSlider from 'nouislider'

// Emits
const emit = defineEmits(['onload', 'onchange'])

// Reactive data
const volume = ref(0)

// Refs
const volumeSlider = ref(null)

onMounted(() => {
  volume.value = settings.load('volume')
  if (volume.value === null) {
    volume.value = 100
  }

  noUiSlider.create(volumeSlider.value, {
    start: [volume.value],
    range: {
      'min': [0],
      'max': [100],
    },
  })

  volumeSlider.value.noUiSlider.on('slide', (values, handle) => {
    volume.value = parseInt(values)
    settings.save('volume', volume.value)
    emit('onchange', volume.value)
  })

  emit('onload', volume.value)
})
</script>
