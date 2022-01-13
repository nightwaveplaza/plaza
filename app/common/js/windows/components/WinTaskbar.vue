<template>
  <div class="taskbar row no-gutters noselect">
    <div class="col-auto ml-1">
      <div class="divider"></div>
    </div>
    <div class="col-auto">
      <win-btn block class="icon pr-2" :class="{active: !isPlayerMinimized}" @click="$store.commit('windows/minimize', !isPlayerMinimized)">
        <img src="img/win/ball.png"/>
        Nightwave Plaza
      </win-btn>
    </div>
    <div class="col-auto ml-1" v-if="!isMobile">
      <win-btn block class="icon pr-2" :class="{active: isMobileOpen}" @click="openCloseMobile">
        <img src="/img/win/phone.png"/>
        Plaza Mobile
      </win-btn>
    </div>
    <div class="col-auto ml-auto local-time">{{ time }}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      time: '00:00 PM',
    };
  },

  computed: {
    ...mapGetters('windows', ['isPlayerMinimized', 'isWindowOpen']),
    isMobileOpen() {
      return this.isWindowOpen('mobile');
    },
  },

  created() {
    setInterval(this.getNow, 1000);
  },

  methods: {
    getNow() {
      this.time = (new Date).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
    },
    openCloseMobile() {
      if (this.isMobileOpen) {
        this.closeWindow('mobile');
      } else {
        this.openWindow('mobile');
      }
    }
  },
};
</script>
