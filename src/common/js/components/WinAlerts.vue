<template>
  <div>
    <window-alert v-for="a in alerts" :key="a.id" :name="a.name" :text="a.text" :title="a.title" :type="a.type"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const alerts = computed(() => store.getters['windows/alerts'])
</script>
