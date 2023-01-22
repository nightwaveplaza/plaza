<template>
  <window-news v-if="isWindowOpen('news')"/>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { news } from '@common/api/api'
import settings from '@common/extras/settings'
import helperComposable from '@common/composables/helperComposable'
import windowsComposable from '@common/composables/windowsComposable'

const store = useStore()

// Composable
const { isMobile } = helperComposable()
const { openWindow2 } = windowsComposable('about')

// Reactive data
const isWindowOpen = computed(() => store.getters['windows/isWindowOpen'])

// Non-reactive
let newsLoaded = false

// Methods
function loadNews () {
  news.latest().then(result => {
    const latestNews = settings.load('latestNews')
    if (latestNews < result.data.updated_at) {
      openWindow2('news')
    }
  })
}

onMounted(() => {
  if (isMobile.value) {
    store.subscribe((mutation) => {
      if (mutation.type === 'pushData' && mutation.payload.name === 'status') {
        if (!newsLoaded) {
          loadNews()
          newsLoaded = true
        }
      }
    })
  }
})

defineExpose({
  loadNews,
})
</script>
