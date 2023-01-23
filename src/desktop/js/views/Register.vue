<template>
  <div class="app-desktop theme-win98">
    <window-user-register :direct="true"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.commit('windows/pullUp', 'user-register')
})
</script>
