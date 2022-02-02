<template>
  <div :style="styles" class="app-desktop" :class="theme">
    <window-player v-show="!isPlayerMinimized"/>

    <window-about v-if="isWindowOpen('about')"/>
    <window-credits v-if="isWindowOpen('credits')"/>
    <window-history v-if="isWindowOpen('history')"/>
    <window-mobile v-if="isWindowOpen('mobile')"/>
    <window-news v-if="isWindowOpen('news')"/>
    <window-ratings v-if="isWindowOpen('ratings')"/>
    <window-settings-background v-if="isWindowOpen('settings-background')" @themeChanged="themeChanged" @bgChanged="setBackground"/>
    <window-support v-if="isWindowOpen('support')"/>
    <window-user v-if="isWindowOpen('user')"/>
    <window-user-email v-if="isWindowOpen('user-email')"/>
    <window-user-favorites v-if="isWindowOpen('user-favorites')"/>
    <window-user-login v-if="isWindowOpen('user-login')"/>
    <window-user-password v-if="isWindowOpen('user-password')"/>
    <window-user-register v-if="isWindowOpen('user-register')"/>
    <window-user-reset v-if="isWindowOpen('user-reset')"/>

    <window-song-info :id="s.id" :name="s.name" v-for="s in songInfoWindows" :key="s.id"/>
    <win-alert :title="a.title" :text="a.text" :name="a.name" :type="a.type" :key="a.id" v-for="a in alerts"/>

    <win-taskbar/>
  </div>
</template>

<script>
import {Background} from '@common/js/extras/background';
import {mapGetters} from 'vuex';
import settings from '@common/js/extras/settings';
import {news, user} from '@common/js/api/api';

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
    ...mapGetters('windows', ['alerts', 'songInfoWindows', 'isPlayerMinimized', 'isWindowOpen']),
    ...mapGetters(['token']),
  },

  mounted: function() {
    this.$store.commit('windows/pullUp', 'player');

    Background.loadOnStartup().then(this.setBackground);
    this.loadUser();

    // Load news
    news.latest().then(result => {
      const latestNews = settings.load('latestNews');
      if (latestNews !== result.data.updated_at) {
        this.openWindow('news');
      }
    });

    // Load theme
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
