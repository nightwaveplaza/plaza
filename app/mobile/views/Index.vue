<template>
  <div :class="theme" :style="styles" class="app-desktop">
    <window-loading v-if="loading"/>
    <window-player v-show="!isPlayerMinimized && !loading"/>
    <window-player-timer v-if="isWindowOpen('player-timer')"/>

    <window-about v-if="isWindowOpen('about')"/>
    <window-credits v-if="isWindowOpen('credits')"/>
    <window-history v-if="isWindowOpen('history')"/>
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

    <win-news-loader/>
    <win-song-info/>
    <win-alerts/>

    <win-taskbar v-if="!loading"/>
  </div>
</template>

<script>
import {Background} from '@base/extras/background';
import {mapGetters} from 'vuex';
import settings from '@base/extras/settings';
import {Native} from '@mobile/bridge/native';

export default {
  data() {
    return {
      styles: {
        backgroundColor: 'transparent',
      },
      theme: 'theme-win98',
    };
  },

  computed: {
    ...mapGetters('windows', ['isPlayerMinimized', 'isWindowOpen']),
    ...mapGetters('player', ['currentSong']),

    loading() {
      return this.currentSong.id === '';
    },
  },

  async mounted() {
    // Load theme
    this.themeChanged(settings.load('theme'));

    // Load background
    const bg = await Background.loadOnStartup();
    await this.setBackground(bg);
  },

  methods: {
    async setBackground(bg) {
      this.styles.backgroundColor = bg.mode === 2 ? bg.color : 'transparent';
      await Native.setBackground(bg.mode === 2 ? 'solid' : bg.image.video_src);
    },

    themeChanged(theme) {
      this.theme = theme ? 'theme-' + theme : 'theme-win98';
    },
  },
};
</script>
