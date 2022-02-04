<template>
  <div :style="styles" class="app-desktop" :class="theme">
    <window-player v-show="!isPlayerMinimized"/>

    <window-about v-if="isWindowOpen('about')"/>
    <window-credits v-if="isWindowOpen('credits')"/>
    <window-history v-if="isWindowOpen('history')"/>
    <window-mobile v-if="isWindowOpen('mobile')"/>
    <window-news v-if="isWindowOpen('news')"/>
    <window-ratings v-if="isWindowOpen('ratings')"/>
    <window-settings-background v-if="isWindowOpen('settings-background')"
                                @themeChanged="themeChanged"
                                @bgChanged="setBackground"/>
    <window-support v-if="isWindowOpen('support')"/>
    <window-user v-if="isWindowOpen('user')"/>
    <window-user-email v-if="isWindowOpen('user-email')"/>
    <window-user-favorites v-if="isWindowOpen('user-favorites')"/>
    <window-user-login v-if="isWindowOpen('user-login')"/>
    <window-user-password v-if="isWindowOpen('user-password')"/>
    <window-user-register v-if="isWindowOpen('user-register')"/>
    <window-user-reset v-if="isWindowOpen('user-reset')"/>

    <win-song-info />
    <win-alerts/>
    <win-news-loader ref="news" />

    <win-taskbar/>
  </div>
</template>

<script>
import {Background} from '@base/extras/background';
import {mapGetters} from 'vuex';
import settings from '@base/extras/settings';
import {news, user} from '@base/api/api';

export default {
  data() {
    return {
      styles: {
        backgroundImage: '',
        backgroundColor: '#008080',
      },
      theme: 'theme-win98',
    };
  },

  computed: {
    ...mapGetters('windows', ['isPlayerMinimized', 'isWindowOpen']),
    ...mapGetters(['token']),
  },

  mounted: function() {
    Background.loadOnStartup().then(this.setBackground);
    this.loadUser();

    this.$refs.news.loadNews();
    this.themeChanged(settings.load('theme'));
  },

  methods: {
    setBackground(bg) {
      if (bg.mode === 2) {
        this.styles.backgroundImage = '';
        this.styles.backgroundColor = bg.color;
      } else {
        this.styles.backgroundImage = `url('${bg.image.src}')`;
        this.styles.backgroundColor = '';
      }
    },

    loadUser() {
      if (this.token) {
        this.$store.commit('user/token', this.token);
        user.get().then(result => {
          this.$store.commit('user/auth', result.data);
        });
      }
    },

    themeChanged(theme) {
      this.theme = theme ? 'theme-' + theme : 'theme-win98';
    },
  },
};
</script>
