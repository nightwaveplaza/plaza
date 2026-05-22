<template>
  <div v-show="activeTab === name">
    <div class="win-tabs__panel">
      <div class="p-2">
        <div class="p-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject, onMounted, onUnmounted } from 'vue';

  const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, required: true },
  });

  const { activeTab, registerTab, unregisterTab } = inject('winTabs');

  onMounted(() => {
    registerTab({ name: props.name, label: props.label });
  });

  onUnmounted(() => {
    unregisterTab(props.name);
  });
</script>
