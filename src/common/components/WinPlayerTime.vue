<template>
  <div class="player-time">{{ display }}</div>
</template>

<script>
import ticker from '@common/extras/ticker';

export default {
  data() {
    return {
      length: 0,
      position: 0,
      actualPosition: 0,
      songUpdated: 0,
      textTime: 0,
      text: '',
    };
  },

  computed: {
    display() {
      return this.textTime > 0 ? this.text : this.clock;
    },

    clock() {
      return this.length > 0 ? this.dur(this.actualPosition) + ' / ' + this.dur(this.length) : '...';
    },
  },

  mounted() {
    this.showText('Welcome back!');
    this.tickerId = ticker.set(this.tick, 300);

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'player/currentSong') {
        this.position = state.player.song.position;
        this.length = state.player.song.length;
        this.songUpdated = Date.now();
      }
    });
  },

  methods: {
    showText(text) {
      this.text = text;
      this.textTime = 2000;
    },

    resetTimer() {
      ticker.stop(this.tickerId);
      this.tickerId = ticker.set(this.tick, 300);
    },

    tick() {
      const now = Date.now();
      const actualPosition = Math.floor((now - this.songUpdated) / 1000) + this.position;

      if (this.songUpdated && this.length - actualPosition > 0) {
        this.actualPosition = actualPosition;
        //
        // if (this.position < this.length) {
        //   this.position += 1;
        // }
      }

      if (this.textTime > 0) {
        this.textTime -= 300;
      }
    },
  },
};
</script>
