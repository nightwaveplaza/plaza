<template>
  <win-window :width="220" name="loading" title="Nightwave Plaza">
    <template v-slot:header>
      <div class="buttons"></div>
    </template>

    <div class="p-3">
      <p class="text-center"><strong>Loading...</strong></p>
      <div ref="bar" class="text-field progress-bar">
        <div ref="progress" :style="style" class="progress"><div /><div /><div /></div>
      </div>
    </div>
  </win-window>
</template>

<script>
export default {
  data() {
    return {
      movedAt: 0,
      direction: 3,
      left: 0,
      loading: true,

      style: {
        transform: `translate(0px, 0px)`,
      },
    }
  },

  mounted() {
    this.$store.commit('windows/pullUp', 'loading');
    this.move();
  },

  beforeDestroy() {
    this.$store.commit('windows/pullUp', 'player');
  },

  destroyed() {
    this.loading = false
  },

  methods: {
    move() {
      if (!this.loading) {
        return
      }

      const now = Date.now()
      if (now - this.movedAt > 30 && this.$refs.bar) {
        if (this.left > this.$refs.bar.offsetWidth - this.$refs.progress.offsetWidth - 6 || this.left < 0) {
          this.direction *= -1
        }

        this.left += this.direction
        this.style.transform = `translate(${this.left}px, 0px)`
        this.movedAt = now
      }

      requestAnimationFrame(this.move)
    },
  },
}
</script>
