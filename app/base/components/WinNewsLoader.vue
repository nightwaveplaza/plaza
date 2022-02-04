<template>
  <window-news v-if="isWindowOpen('news')"/>
</template>

<script>
import {mapGetters} from 'vuex';
import {news} from '@base/api/api';
import settings from '@base/extras/settings';

export default {
  data() {
    return {
      newsLoaded: false,
    };
  },

  computed: {
    ...mapGetters('windows', ['isWindowOpen']),
  },

  mounted() {
    if (this.isMobile) {
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'pushData' && mutation.payload.name === 'status') {
          if (!this.newsLoaded) {
            this.loadNews();
            this.newsLoaded = true;
          }
        }
      });
    }
  },

  methods: {
    loadNews() {
      news.latest().then(result => {
        const latestNews = settings.load('latestNews');
        if (latestNews !== result.data.updated_at) {
          this.openWindow('news');
        }
      });
    },
  },
};
</script>
