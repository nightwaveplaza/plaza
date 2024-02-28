<template>
  <div class="app-desktop" :class="theme" :style="{backgroundImage, backgroundColor}">
    <component v-for="window in windows" :is="window.form" />

    <win-news-loader ref="newsLoader"/>

    <window-song :id="s.id" :name="s.name" v-for="s in songs" :key="s.id"/>
    <window-alert v-for="a in alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>

    <win-taskbar/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import windowsComposable from '@common/js/composables/windowsComposable'
import userPrefsComposable from '@common/js/composables/userPrefsComposable'

const store = useStore()

const { openWindow } = windowsComposable()
const { loadBackground, loadTheme, loadUser } = userPrefsComposable()

// Windows
const windows = computed(() => store.getters['windows/windows'])
const alerts = computed(() => store.getters['windows/alerts'])
const songs = computed(() => store.getters['windows/songWindows'])

// Appearance
const backgroundImage = computed(() => `url('${store.getters['appearance/backgroundImage'].src}')`)
const backgroundColor = computed(() => store.getters['appearance/backgroundColor'])
const theme = computed(() => 'theme-' + store.getters['appearance/theme'])

const newsLoader = ref(null)

function startup() {
  openWindow('player')
  openWindow('loading')

  loadBackground()
  loadTheme()
  loadUser()

  newsLoader.value.loadNews()
}

onMounted(() => {
  startup()
})
</script>
