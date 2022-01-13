<template>
  <div ref="memo" class="memo p-2" :class="{scroll: scroll}">
    <slot/>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar';

export default {
  props: {
    scroll: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    if (this.scroll) {
      this.scrollbar = new PerfectScrollbar(this.$refs.memo);
    }
  },

  beforeDestroy() {
    if (this.scroll) {
      this.scrollbar.destroy();
      this.scrollbar = null;
    }
  },
};
</script>
