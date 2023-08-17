<template>
  <div :style="styles" class="app-desktop" :class="theme">
    <div class="video-frame" :style="{'visibility': videoSrc !== '' ? 'visible ' : 'hidden'}">
      <video autoplay ref="video" muted loop>
        <source :src="videoSrc" />
      </video>
    </div>

    <window-player/>

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

    <win-song-info/>
    <win-alerts/>
    <win-news-loader ref="newsLoader"/>

    <win-taskbar/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Background } from '@common/js/extras/background'
import settings from '@common/js/extras/settings'
import { news, user } from '@common/js/api/api'

const store = useStore()

// Reactive data
const styles = ref({
  // backgroundImage: '',
  backgroundColor: '#008080',
})
const videoSrc = ref('')
const theme = ref('theme-win98')
const isWindowOpen = computed(() => store.getters['windows/isWindowOpen'])
const token = computed(() => store.getters['token'])

// Refs
const video = ref(null)
const newsLoader = ref(null)

// Methods
function setBackground (bg) {
  if (bg.mode === 2) {
    videoSrc.value = ''
    // styles.value.backgroundImage = ''
    styles.value.backgroundColor = bg.color
  } else {

    videoSrc.value = bg.image.video_src
    video.value.load()
    video.value.play()
    // styles.value.backgroundImage = `url('${bg.image.src}')`
    // styles.value.backgroundColor = ''
  }
}

function loadUser () {
  if (token.value) {
    store.commit('user/token', token.value)
    user.get().then(result => {
      store.commit('user/auth', result.data)
    }).catch(() => {})
  }
}

function themeChanged (newTheme) {
  theme.value = newTheme ? 'theme-' + newTheme : 'theme-win98'
}

onMounted(() => {
  Background.loadOnStartup().then(setBackground)
  loadUser()

  newsLoader.value.loadNews()
  themeChanged(settings.load('theme'))
})
</script>
