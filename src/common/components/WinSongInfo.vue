<template>
  <div>
    <window-song :id="s.id" :name="s.name" v-for="s in songWindows" :key="s.id"/>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const songWindows = computed(() => store.getters['windows/songWindows'])
</script>
