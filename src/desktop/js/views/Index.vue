<template>
  <div class="app-desktop" :class="theme" :style="{backgroundImage, backgroundColor}">
    <component v-for="window in windows" :is="`window-${window.name}`" />

    <win-news-loader ref="newsLoader"/>

    <window-song :id="s.id" :name="s.name" v-for="s in songs" :key="s.id"/>
    <window-alert v-for="a in alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>
    <win-taskbar/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Background } from '@common/js/extras/background'
import settings from '@common/js/extras/settings'
import { user } from '@common/js/api/api'
import windowsComposable from '@common/js/composables/windowsComposable'

// Store
const store = useStore()

// Composable
const { openWindow } = windowsComposable()

// Reactive data
const windows = computed(() => store.getters['windows/windows'])
const alerts = computed(() => store.getters['windows/alerts'])
const token = computed(() => store.getters['token'])
const songs = computed(() => store.getters['windows/songWindows'])

// Appearance
const backgroundImage = computed(() => store.getters['appearance/backgroundImage'])
const backgroundColor = computed(() => store.getters['appearance/backgroundColor'])
const theme = computed(() => store.getters['appearance/theme'])

// Refs
const newsLoader = ref(null)

// Methods
function startup() {
  openWindow('player')
  openWindow('loading')

  Background.loadOnStartup().then((background) => {
    store.commit('appearance/background', background)
  })

  loadUser()

  newsLoader.value.loadNews()
  store.commit('appearance/theme', settings.load('theme'))
}

function loadUser () {
  if (token.value) {
    store.commit('user/token', token.value)
    user.get().then(result => {
      store.commit('user/auth', result.data)
    }).catch(() => {})
  }
}

onMounted(() => {
  startup()
})
</script>
