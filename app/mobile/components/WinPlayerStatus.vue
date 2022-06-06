<template/>

<script>
const OSD_UPDATE_INTERVAL = 10000;
const REQUEST_INTERVAL = 1000;

import {mapGetters} from 'vuex';
import {status} from '@base/api/api';
import ticker from '@base/extras/ticker';
import {Native} from '@mobile/bridge/native';

export default {
  computed: {
    ...mapGetters('player', ['currentSong']),
  },

  created() {
    this.statusUpdatedAt = 0;
    this.requestSentAt = 0;
    this.osdUpdatedAt = 0;
    this.updating = false;
    this.tickerId = ticker.set(this.tick, 1000);
  },

  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'pushData') {

        if (mutation.payload.name === 'status') {
          this.setStatus(state.data['status']);
        }

        if (mutation.payload.name === 'artwork') {
          this.setArtwork(state.data['artwork']);
        }

        if (mutation.payload.name === 'reactionUpdate') {
          this.$store.commit('player/reaction', state.data['reactionUpdate'].score);
          this.updateOsd();
        }
      }
    });

    this.tick();
  },

  methods: {
    async tick() {
      const now = Date.now();

      const actualPosition = this.currentSong.position + Math.floor(((now - this.statusUpdatedAt) / 1000));

      if (!this.currentSong.id) {
        await this.requestUpdate();
      } else if (now - this.osdUpdatedAt > OSD_UPDATE_INTERVAL) {
        await this.updateOsd();
      } else if (this.currentSong.length - actualPosition < 3) {
        await this.requestUpdate();
      }
    },

    async requestUpdate() {
      const now = Date.now();
      if (now - this.requestSentAt >= REQUEST_INTERVAL) {
        this.requestSentAt = now;
        await Native.requestUiUpdate();
      }
    },

    async updateOsd() {
      if (this.updating) return;
      this.updating = true;

      let data = [];
      try {
        data = (await status.getOsd()).data;
      } catch (e) {
        console.log(`Failed to update status: ${e}`);
      } finally {
        this.updating = false;
        this.osdUpdatedAt = Date.now();
      }

      if (data[0] !== this.currentSong.id) {
        await this.requestUpdate();
      } else {
        this.$store.commit('player/listeners', data[1]);
        this.$store.commit('player/reactions', data[2]);
      }
    },

    async setStatus(status) {
      if (JSON.stringify(status) === '{}' || status.updated === 0 || status.id === '') {
        return;
      }

      // If song has been changed
      if (status.id !== this.currentSong.id) {
        this.$store.commit('player/currentSong', {
          id: status.id,
          artist: status.artist,
          title: status.title,
          position: status.position,
          length: status.length,
          artwork_src: status.artwork_src,
          reactions: status.likes,
        });
        this.$store.commit('player/listeners', status.listeners);
        this.osdUpdatedAt = Date.now();
      }

      this.$store.commit('isPlaying', status.isPlaying);
      this.$store.commit('sleepTime', status.sleepTime);
      this.statusUpdatedAt = Date.now();
    },

    setArtwork(artwork) {
      if (this.currentSong.id) {
        this.$store.commit('player/artwork', artwork);
      }
    },
  },
};
</script>
