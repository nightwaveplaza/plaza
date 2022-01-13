<template>
  <div ref="list" class="list" :class="{scroll: scroll}">
    <table class="hover">
      <slot/>
    </table>
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

  methods: {
    scrollTop() {
      this.$refs.list.scrollTop = 0;
    },

    refreshScrollbar() {
      if (this.scroll) {
        this.$nextTick(() => {
          this.scrollbar.update();
        });
      }
    },
  },

  mounted() {
    if (this.scroll) {
      this.scrollbar = new PerfectScrollbar(this.$refs.list);
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
