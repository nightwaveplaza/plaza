<template>
  <div>
    <window-song :id="s.id" :name="s.name" v-for="s in songWindows" :key="s.id"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const songWindows = computed(() => store.getters['windows/songWindows'])
</script>
