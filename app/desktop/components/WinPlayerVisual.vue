<template>
  <canvas ref="canvas" class="player-visual"/>
</template>

<script>
const VISUAL_BARS = "rgba(255,255,255,0.6)";
const MAX_FREQ_VISUAL = 14000;

export default {
  props: {
    link: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      canvasContext: false,
      canvasWidth: 0,
      canvasHeight: 0,
      visualBars: 0,
      visualEnabled: false,
    };
  },

  computed: {
    canvas: function() {
      return this.$refs['canvas'];
    },
  },

  methods: {
    startVisual() {
      this.analyser = this.$parent.analyser;
      this.context = this.$parent.context;
      this.canvasContext = this.canvas.getContext('2d');
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this.canvasWidth = this.canvas.width;
      this.canvasHeight = this.canvas.height;
      this.analyser.fftSize = 512;
      this.calcVisualFreqs();
      this.visualEnabled = true;
      this.visualize();
    },

    stopVisual() {
      this.visualEnabled = false;
      if (this.canvasContext) {
        this.canvasContext.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      }
    },

    calcVisualFreqs() {
      const sampleRate = this.context.sampleRate;
      const freqStep = sampleRate / (this.analyser.frequencyBinCount * 2);
      let endFreq = freqStep;

      while (endFreq + freqStep < MAX_FREQ_VISUAL) {
        endFreq += freqStep;
        this.visualBars += 1;
      }
    },

    visualize() {
      if (!this.visualEnabled) {
        return;
      }

      requestAnimationFrame(this.visualize);
      this.canvasContext.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

      const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(frequencyData);

      for (let i = 0; i < this.visualBars; i++) {
        const height = Math.ceil((this.canvasHeight * frequencyData[i]) / 255);
        const width = Math.ceil(this.canvasWidth / this.visualBars);
        this.canvasContext.fillStyle = VISUAL_BARS;
        this.canvasContext.fillRect(i * width, this.canvasHeight - height,
            width, height);
      }
    },
  },
};
</script>
