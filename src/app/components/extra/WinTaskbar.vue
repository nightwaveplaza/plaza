<template>
  <win-start-menu :class="{ 'is-top': taskbarPosition === 'top' }" />

  <div class="win-taskbar d-flex flex-nowrap" :class="{ 'taskbar-top': taskbarPosition === 'top' }">
    <win-start-button
      class="d-none d-sm-inline-flex ms-1"
      style="min-width: 65px; justify-content: center"
    />

    <div class="flex-shrink-0">
      <div class="divider mx-1" />
    </div>

    <win-button
      v-for="window in openedWindows"
      :key="window.id"
      class="me-1 flex-grow-1"
      :class="{ active: activeWindow === window.id && !window.isMinimized }"
      :icon="getWindowIcon(window)"
      @click="toggleMinimize(window.id)"
    >
      {{ window.title ? window.title : window.titleKey ? t(window.titleKey) : ' ' }}
    </win-button>

    <div class="local-time ms-auto flex-shrink-0 d-flex align-items-center">
      <win-connection-status />
      <div class="px-2">{{ time }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { i18n } from '@locales/_i18n.ts';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { useAppSettings } from '@app/composables/useAppSettings.ts';
  import { useI18n } from 'vue-i18n';
  import { getWindowIcon } from '@app/utils/icons.ts';

  const { toggleMinimize, openedWindows, activeWindow } = useWindows();
  const { taskbarPosition } = useAppSettings();
  const { t } = useI18n();

  const time = ref('0:00 PM');

  function getNow(): void {
    time.value = new Date().toLocaleString(i18n.global.locale as Intl.LocalesArgument, {
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  onBeforeMount(() => {
    getNow();
  });

  onMounted(() => {
    setInterval(getNow, 1000);
  });
</script>
