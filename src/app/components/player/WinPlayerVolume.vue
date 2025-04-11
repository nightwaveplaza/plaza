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
import type { API as noUiSliderAPI } from 'nouislider'

/**
 * This component renders a volume slider using noUiSlider.
 * It accepts a volume prop (number between 0–100) from the parent,
 * and emits an event ('update-volume') when the slider value changes.
 *
 * The centralized volume state (from useVolumeControl) lives in the parent,
 * so this component simply acts as a presentational control.
 */

// Define props – current volume value is passed in by the parent.
const props = defineProps<{ volume: number }>()

// Define emits – notify the parent when slider value changes.
const emit = defineEmits<{ (e: 'update-volume', newVolume: number): void }>()

const volumeSlider = ref<HTMLDivElement | null>(null)

// Store slider instance so we can update it when the parent's volume changes.
let sliderInstance: noUiSliderAPI | null = null

/**
 * createSlider
 * Initializes slider with parent's volume value.
 * On slider movement, it emits an 'update-volume' event with the new value.
 */
 function createSlider(): void {
  if (volumeSlider.value) {
    sliderInstance = noUiSlider.create(volumeSlider.value, {
      start: [props.volume],
      range: {
        min: [0],
        max: [100],
      },
    })

    // When the slider is moved, emit the new volume value.
    sliderInstance.on('slide', (values: (string | number)[]) => {
      const newVolume = Math.round(Number(values[0]))
      emit('update-volume', newVolume)
    })
  }
}

// When component mounts, create slider
onMounted(() => {
  createSlider()
})

// If the parent's volume prop changes, update the slider value.
// TODO this makes slider move laggy
// watch(
//   () => props.volume,
//   (newVolume) => {
//     if (sliderInstance) {
//       sliderInstance.set(newVolume)
//     }
//   }
// )
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
