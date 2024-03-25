<template>
  <div class="app-desktop theme-win98">
    <window-user-reset-password v-if="windowsStore.isOpened('user-reset-password')" :token="token"/>
    <window-user-reset v-if="windowsStore.isOpened('user-reset')"/>

    <window-alert v-for="a in windowsStore.alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const router = useRouter()
const route = useRoute()
const windowsStore = useWindowsStore()

// Reactive data
const token = ref('')

watch(windowsStore.alerts, (n) => {
  if (n.length === 0 && !windowsStore.isOpened('user-reset-password') && !windowsStore.isOpened('user-reset')) {
    router.push({ name: 'index' })
  }
})

onMounted(() => {
  if (route.params.token) {
    token.value = route.params.token
    windowsStore.open('user-reset-password')
  } else {
    windowsStore.open('user-reset')
  }
})
</script>
