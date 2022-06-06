<template/>

<script>
const OSD_UPDATE_INTERVAL = 10000;

import {status} from '@base/api/api';
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters('player', ['currentSong']),
  },

  created() {
    this.statusUpdatedAt = 0;
    this.osdUpdatedAt = 0;
    this.updating = false;
  },

  mounted() {
    this.tick();
  },

  methods: {
    async tick() {
      const now = Date.now();
      const actualPosition = this.currentSong.position + Math.floor(((now - this.statusUpdatedAt) / 1000));

      if (!this.currentSong.id) {
        await this.updateStatus();
      } else if (now - this.osdUpdatedAt > OSD_UPDATE_INTERVAL) {
        await this.updateOsd();
      } else if (this.currentSong.length - actualPosition < 3) {
        await this.updateStatus();
      }

      setTimeout(this.tick, 1000);
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
        await this.updateStatus();
      } else {
        this.$store.commit('player/listeners', data[1]);
        this.$store.commit('player/reactions', data[2]);
      }
    },

    async updateStatus() {
      if (this.updating) return;
      this.updating = true;

      try {
        const data = (await status.get()).data;
        this.$store.commit('player/currentSong', data.song);
        this.$store.commit('player/listeners', data.listeners);
      } catch (e) {
        console.log(`Failed to update status: ${e}`);
      } finally {
        this.updating = false;
        this.osdUpdatedAt = Date.now();
        this.statusUpdatedAt = Date.now();
      }
    },
  },
};
</script>
