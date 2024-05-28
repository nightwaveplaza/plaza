<template>
  <win-window ref="win" :width="220" name="settings" title="Settings" v-slot="winProps">
    <div class="p-2 noselect">
      <div class="row">
        <div class="col-10 offset-1">
          <win-button block class="mb-2" @click="open('settings-background')">Appearance settings</win-button>
          <win-button block class="mb-2" @click="switchAudioQuality">Audio quality: <strong>{{ quality }}</strong>
          </win-button>
        </div>
      </div>

      <div class="row no-gutters justify-content-center">
        <div class="col-6">
          <win-button block @click="winProps.close()">Close</win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { Native } from '@mobile/bridge/native'
import { computed, onMounted, ref } from 'vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { useWindowsStore } from '@app/stores/windowsStore'

const windowStore = useWindowsStore()

const win = ref<InstanceType<typeof WinWindow>>()
const lowQualityAudio = ref(false)
const quality = computed(() => lowQualityAudio.value ? 'Eco' : 'High')

function switchAudioQuality () {
  lowQualityAudio.value = !lowQualityAudio.value
  Native.setAudioQuality(lowQualityAudio.value)
}

function open (window: string) {
  windowStore.open(window)
  win.value!.close()
}

onMounted(() => {
  Native.getAudioQuality()!.then(q => lowQualityAudio.value = q as boolean)
})
</script>
