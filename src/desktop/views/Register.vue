<template>
  <div class="app-desktop theme-win98">
    <window-user-register :direct="true"/>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { onMounted } from 'vue'

const store = useStore()

onMounted(() => {
  store.commit('windows/pullUp', 'user-register');
})
</script>
