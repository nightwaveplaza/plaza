<template>
  <div class="player-volume">
    <div class="player-volume-icon" />
    <div class="player-volume-control">
      <div id="player-volume-range" ref="volumeSlider" />
    </div>
    <div class="player-volume-line simple-border" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import noUiSlider from 'nouislider'
import { usePrefs } from '@app/composables/usePrefs'

const emit = defineEmits(['onload', 'onchange'])

const volumeSlider = ref<HTMLDivElement | null>(null)

// Non-reactive
let volume = 0

function createSlider (): void {
  noUiSlider.create(volumeSlider.value!, {
    start: [volume],
    range: {
      'min': [0],
      'max': [100],
    },
  }).on('slide', (values) => {
    volume = Math.round(values[0] as number)
    usePrefs.save('volume', volume)
    emit('onchange', volume)
  })
}

onMounted(() => {
  volume = usePrefs.get<number>('volume', 100)
  createSlider()
  emit('onload', volume)
})
</script>

<style lang="scss">
#window-player {
  .player-volume {
    height: 26px;
  }

  .player-volume-icon {
    width: 11px;
    height: 16px;
    float: right;
    margin: 5px 0 0 0;
    line-height: 26px;
    text-align: center;
    background: url('@app/assets/img/volume.png') no-repeat center center;
  }

  .player-volume-icon img {
    line-height: 0;
    margin: 0;
    padding: 0;
    vertical-align: 0;
  }

  .player-volume-control {
    margin: 0 16px 0 0;
    height: 26px;
  }

  .player-volume-line {
    height: 4px;
    border-radius: 0;
    position: absolute;
    top: 10px;
    left: 0;
    right: 18px;
  }

  .noUi-horizontal .noUi-handle {
    right: -18px;
  }
}
</style>
