<template>
  <win-window name="player" title="Nightwave Plaza" :width="450">

    <!-- Minimize button -->
    <template v-slot:header>
      <div class="buttons">
        <win-btn class="button-minimize" @click="minimize"><span/></win-btn>
        <win-btn v-if="fullScreenEnabled" class="button-maximize" @click="requestFullScreen"><span/></win-btn>
      </div>
    </template>

    <!-- Menu -->
    <win-menu/>

    <!-- Player -->
    <div class="content p-1 p-sm-2">
      <win-player />
    </div>

    <!-- Statusbar -->
    <div class="statusbar row no-gutters">
      <div class="col cell">
        Listeners: {{ listeners }}
      </div>
      <div v-if="auth" class="col-5 col-sm-3 cell login">
        Logged as: {{ username }}
      </div>
    </div>
  </win-window>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters('player', ['listeners']),
    ...mapGetters('user', ['auth', 'username']),

    fullScreenEnabled() {
      return document.fullscreenEnabled;
    },
  },

  methods: {
    minimize() {
      this.$store.commit('windows/minimize', true);
    },

    requestFullScreen() {
      document.getElementById('app').requestFullscreen();
    },
  },
};
</script>
