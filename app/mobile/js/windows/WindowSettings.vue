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
          <win-btn block @click="$refs.window.close()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {Native} from '../bridge/native';

export default {
  data() {
    return {
      audioQuality: 0,
    };
  },

  computed: {
    quality() {
      return this.audioQuality === 1 ? 'Eco' : 'High';
    },
  },

  async mounted() {
    this.audioQuality = await Native.getAudioQuality();
  },

  methods: {
    open(window) {
      this.openWindow(window);
      this.$refs.window.close();
    },

    switchAudioQuality() {
      this.audioQuality = +(!this.audioQuality);
      Native.setAudioQuality(this.audioQuality);
    },
  },
};
</script>
