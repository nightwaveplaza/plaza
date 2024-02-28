<template>
  <div :class="theme" :style="styles" class="app-desktop">
    <component v-for="window in windows" :is="window.form"/>

    <win-news-loader ref="newsLoader"/>

    <window-song :id="s.id" :name="s.name" v-for="s in songs" :key="s.id"/>
    <window-alert v-for="a in alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Native } from '@mobile/js/bridge/native'
import userPrefsComposable from '@common/js/composables/userPrefsComposable'

const { loadBackground, loadTheme } = userPrefsComposable()

const store = useStore()

// Reactive date
const styles = ref({
  backgroundColor: 'transparent',
})

// Windows
const windows = computed(() => store.getters['windows/windows'])
const alerts = computed(() => store.getters['windows/alerts'])
const songs = computed(() => store.getters['windows/songWindows'])

const currentSong = computed(() => store.getters['player/currentSong'])
const loading = computed(() => currentSong.value.id === '')
const theme = computed(() => 'theme-' + store.getters['appearance/theme'])

function startup () {
  openWindow('player')
  openWindow('loading')

  loadBackground()
  loadTheme()

  Native.getAuthToken().then(token => store.commit('user/token', token))
  Native.getUserAgent().then(agent => store.commit('user/agent', agent))
}

// Methods
function setBackground (bg) {
  styles.value.backgroundColor = bg.mode === 2 ? bg.color : 'transparent'
  Native.setBackground(bg.mode === 2 ? 'solid' : bg.image.src)
}

onMounted(() => {
  startup()

  loadBackground()

  store.subscribe((mutation) => {
    if (mutation.type === 'pushData' && mutation.payload.name === 'resume') {
      loadBackground()
    }

    if (mutation.type === 'appearance/background') {
      setBackground(mutation.payload)
    }
  })
})
</script>
