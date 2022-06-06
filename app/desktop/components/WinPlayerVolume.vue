<template>
  <div class="player-volume">
    <div class="player-volume-icon"/>
    <div class="player-volume-control">
      <div id="player-volume-range" ref="volume"></div>
    </div>
    <div class="player-volume-line simple-border"></div>
  </div>
</template>

<script>
import settings from '@base/extras/settings';
import noUiSlider from 'nouislider';

export default {
  mounted() {
    this.volume = settings.load('volume');

    if (this.volume === null) {
      this.volume = 100;
    }

    noUiSlider.create(this.$refs.volume, {
      start: [this.volume],
      range: {
        'min': [0],
        'max': [100],
      },
    });

    this.$refs.volume.noUiSlider.on('slide', (values, handle) => {
      this.volume = parseInt(values);
      settings.save('volume', this.volume);
      this.$emit('onchange', this.volume);
    });

    this.$emit('onload', this.volume);
  }
}
</script>
