<template>
  <div :class="theme" :style="styles" class="app-desktop">
    <window-loading v-if="loading"/>
    <window-player v-show="!isPlayerMinimized && !loading"/>
    <window-player-timer v-if="isWindowOpen('player-timer')"/>

    <window-about v-if="isWindowOpen('about')"/>
    <window-credits v-if="isWindowOpen('credits')"/>
    <window-history v-if="isWindowOpen('history')"/>
    <window-news v-if="isWindowOpen('news')"/>
    <window-ratings v-if="isWindowOpen('ratings')"/>
    <window-settings v-if="isWindowOpen('settings')"/>
    <window-settings-background v-if="isWindowOpen('settings-background')"
                                @bgChanged="setBackground"
                                @themeChanged="themeChanged"
    />
    <window-donate v-if="isWindowOpen('donate')"/>
    <window-user v-if="isWindowOpen('user')"/>
    <window-user-email v-if="isWindowOpen('user-email')"/>
    <window-user-favorites v-if="isWindowOpen('user-favorites')"/>
    <window-user-login v-if="isWindowOpen('user-login')"/>
    <window-user-password v-if="isWindowOpen('user-password')"/>
    <window-user-register v-if="isWindowOpen('user-register')"/>
    <window-user-reset v-if="isWindowOpen('user-reset')"/>

    <window-song-info v-for="s in songInfoWindows" :id="s.id" :key="s.id" :name="s.name"/>
    <win-alert v-for="a in alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar v-if="!loading"/>
  </div>
</template>

<script>
import {Background} from '@common/js/extras/background';
import {mapGetters} from 'vuex';
import settings from '@common/js/extras/settings';
import {news} from '@common/js/api/api';
import {Native} from './bridge/native';

export default {
  data() {
    return {
      styles: {
        backgroundColor: 'transparent',
      },
      theme: 'theme-win98',
      newsLoaded: false,
    };
  },

  computed: {
    ...mapGetters('windows', ['alerts', 'songInfoWindows', 'isPlayerMinimized', 'isWindowOpen']),
    ...mapGetters('player', ['currentSong',]),

    loading() {
      return this.currentSong.id === '';
    },
  },

  async mounted() {
    // Load theme
    this.themeChanged(settings.load('theme'));

    // Load token
    const token = await Native.getAuthToken();
    const userAgent = await Native.getUserAgent();
    this.$store.commit('user/token', token);
    this.$store.commit('userAgent', userAgent);

    // Load background
    const bg = await Background.loadOnStartup();
    await this.setBackground(bg);

    // Load news
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'pushData' && mutation.payload.name === 'status') {
        if (!this.newsLoaded) {
          this.loadNews();
          this.newsLoaded = true;
        }
      }
    });
  },

  methods: {
    async setBackground(bg) {
      this.styles.backgroundColor = bg.mode === 2 ? bg.color : 'transparent';
      await Native.setBackground(bg.mode === 2 ? 'solid' : bg.image.video_src);
    },

    themeChanged(theme) {
      this.theme = theme ? 'theme-' + theme : 'theme-win98';
    },

    loadNews() {
      news.latest().then(res => {
        const latestNews = settings.load('latestNews');
        if (latestNews !== res.data.updated_at) {
          this.openWindow('news');
        }
      });
    },
  },
};
</script>
