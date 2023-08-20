<template>
  <div class="app-desktop theme-win98">
    <window-user-reset-password v-if="isWindowOpen('user-reset-password')" :token="token"/>
    <window-user-reset v-if="isWindowOpen('user-reset')"/>

    <win-alerts/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()
const router = useRouter()
const route = useRoute()

// Composable
const { openWindow } = windowsComposable()

// Reactive data
const token = ref('')
const alerts = computed(() => store.getters['windows/alerts'])
const isWindowOpen = computed(() => store.getters['windows/isWindowOpen'])

watch(alerts, (n) => {
  if (n.length === 0 && !isWindowOpen.value('user-reset-password') && !isWindowOpen.value('user-reset')) {
    router.push({ name: 'index' })
  }
})

onMounted(() => {
  if (route.params.token) {
    token.value = route.params.token
    openWindow('user-reset-password')
  } else {
    openWindow('user-reset')
  }
})
</script>
