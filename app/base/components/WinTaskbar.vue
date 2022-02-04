<template>
  <div class="taskbar d-flex flex-nowrap">
    <div style="flex: 0 0 10px">
      <div class="divider mx-1"/>
    </div>
    <win-btn class="mr-1" style="flex: 1 1 auto"
             :class="{active: activeWindow === window.name && !isWindowMinimized(window.name)}"
             v-for="window in windows"
             :key="window.name"
             @click="toggleMinimize(window.name)">
      <img src="/img/win/ball.png"/>
      <div class="title" v-html="window.title"/>
    </win-btn>

    <div class="local-time ml-auto" style="flex: 0 0 60px">{{ time }}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import ticker from '@base/extras/ticker';

export default {
  data() {
    return {
      time: '0:00 PM',
    };
  },

  computed: {
    ...mapGetters('windows', ['isWindowOpen', 'windows', 'activeWindow', 'isWindowMinimized']),
  },

  created() {
    ticker.set(this.getNow, 1000);
  },

  methods: {
    getNow() {
      this.time = (new Date).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
    },

    toggleMinimize(name) {
      if (this.isWindowMinimized(name)) {
        this.$store.dispatch('windows/restore', name);
      } else {
        if (this.activeWindow === name) {
          this.$store.dispatch('windows/minimize', name);
        } else {
          this.$store.commit('windows/pullUp', name);
        }
      }
    },
  },
};
</script>
