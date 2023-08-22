<template>
  <div :class="theme" :style="styles" class="app-desktop">
    <window-loading v-if="loading"/>
    <window-player v-show="!loading"/>
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

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import {Background} from '@common/js/extras/background';
import settings from '@common/js/extras/settings';
import {Native} from '@mobile/js/bridge/native';

const store = useStore()

// Reactive date
const styles = ref({
  backgroundColor: 'transparent'
})
const theme = ref('theme-win98')
const isWindowOpen = computed(() => store.getters['windows/isWindowOpen'])
const currentSong = computed(() => store.getters['player/currentSong'])
const loading = computed(() => currentSong.value.id === '')

// Methods
function setBackground(bg) {
  styles.value.backgroundColor = bg.mode === 2 ? bg.color : 'transparent';
  Native.setBackground(bg.mode === 2 ? 'solid' : bg.image.src);
}

function themeChanged(newTheme) {
  theme.value = newTheme ? 'theme-' + newTheme : 'theme-win98';
}

onMounted(() => {
  // Load token
  Native.getAuthToken().then(token => store.commit('user/token', token))
  Native.getUserAgent().then(agent => store.commit('user/agent', agent))

  themeChanged(settings.load('theme'));
  Background.loadOnStartup().then(bg => setBackground(bg))

  store.subscribe((mutation) => {
    if (mutation.type === 'pushData' && mutation.payload.name === 'resume') {
      Background.loadOnStartup().then(bg => setBackground(bg))
    }
  })
})
</script>
