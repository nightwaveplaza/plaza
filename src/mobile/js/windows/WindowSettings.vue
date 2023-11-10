<template>
  <win-window ref="window" :width="220" name="settings" title="Settings">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-btn block class="mb-2" @click="open('settings-background')">Appearance settings</win-btn>
          <win-btn block class="mb-2" @click="switchAudioQuality">Audio quality: <strong>{{ quality }}</strong>
          </win-btn>
        </div>
      </div>

      <div class="row no-gutters justify-content-center">
        <div class="col-6">
          <win-btn block @click="closeWindow">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import {Native} from '@mobile/js/bridge/native';
import { computed, onMounted, ref } from 'vue'
import windowsComposable from '@common/js/composables/windowsComposable'

// Composable
const { openWindow, closeWindow } = windowsComposable('settings')

// Reactive data
const lowQualityAudio = ref(false)
const quality = computed(() => lowQualityAudio.value ? 'Eco' : 'High')

// Methods
function switchAudioQuality() {
  lowQualityAudio.value = !lowQualityAudio.value;
  Native.setAudioQuality(lowQualityAudio.value);
}

function open(window) {
  openWindow(window);
  closeWindow();
}

onMounted(() => {
  Native.getAudioQuality().then(q => lowQualityAudio.value = q)
})
</script>
