<template>
  <div class="win-taskbar d-flex flex-nowrap" :class="{'taskbar-top': taskbarPosition === 'top'}">
    <div style="flex: 0 0 10px">
      <div class="divider mx-1" />
    </div>

    <win-button
      v-for="window in openedWindows"
      :key="window.id"
      class="me-1" style="flex: 1 1 auto"
      :class="{active: activeWindow === window.id && !window.isMinimized }"
      @click="toggleMinimize(window.id)"
    >
      <div class="window-icon" :class="window.icon" />
      <div class="title">
        {{ window.title ? window.title : window.titleKey ? t(window.titleKey) : ' ' }}
      </div>
    </win-button>

    <div class="local-time ms-auto" style="flex: 0 0 90px">
      <win-connection-status v-if="!isMobile()" /> {{ time }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { i18n } from '@locales/_i18n.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { isMobile } from '@app/utils/helpers.ts'
import { useI18n } from 'vue-i18n'

const { toggleMinimize, openedWindows, activeWindow } = useWindows()
const { taskbarPosition } = useAppSettings()
const { t } = useI18n()

const time = ref('0:00 PM')

function getNow (): void {
  time.value = (new Date()).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { hour: 'numeric', minute: 'numeric' }
  )
}

onBeforeMount(() => {
  getNow()
})

onMounted(() => {
  setInterval(getNow, 1000)
})
</script>
