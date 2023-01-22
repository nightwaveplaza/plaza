<template>
  <div class="app-desktop theme-win98">
    <window-support :direct="true"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.commit('windows/pullUp', 'support')
})
</script>
