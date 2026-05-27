<template>
  <div class="win-tabs">
    <div>
      <win-button
        v-for="tab in tabs"
        :key="tab.name"
        class="win-tabs__button"
        :class="{ 'is-active': activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        {{ tab.label }}
      </win-button>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { ref, provide } from 'vue';

  const tabs = ref([]);

  const activeTab = ref(null);

  function registerTab({ name, label }) {
    if (tabs.value.some(t => t.name === name)) return;

    tabs.value.push({ name, label });

    if (!activeTab.value) {
      activeTab.value = name;
    }
  }

  function unregisterTab(name) {
    tabs.value = tabs.value.filter(t => t.name !== name);

    if (activeTab.value === name) {
      activeTab.value = tabs.value[0]?.name ?? null;
    }
  }

  provide('winTabs', {
    activeTab,
    registerTab,
    unregisterTab,
  });
</script>
