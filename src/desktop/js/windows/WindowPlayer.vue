<template>
  <win-window ref="win" name="player" title="Nightwave Plaza" :width="450">
    <!-- Minimize button -->
    <template #header>
      <div class="buttons">
        <win-button class="button-minimize" @click="minimize">
          <span />
        </win-button>
        <win-button v-if="fullScreenEnabled" class="button-maximize" @click="requestFullScreen">
          <span />
        </win-button>
      </div>
    </template>

    <!-- Menu -->
    <win-menu />

    <!-- Player -->
    <div class="content p-1 p-sm-2">
      <win-player />
    </div>

    <!-- Statusbar -->
    <div class="statusbar row no-gutters">
      <div class="col cell">
        {{ t('win.player.listeners', {listeners: playerPlaybackStore.listeners}) }}
      </div>
      <div v-if="userAuthStore.signed" class="col-5 col-sm-3 cell login">
        {{ t('win.player.user', {user: userAuthStore.username}) }}
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'

const { t } = useI18n()
const userAuthStore = useUserAuthStore()
const windowsStore = useWindowsStore()
const playerPlaybackStore = usePlayerPlaybackStore()

const fullScreenEnabled = computed(() => document.fullscreenEnabled)
const win = ref<InstanceType<typeof WinWindow>>()

function minimize (): void {
  windowsStore.minimize('player')
}

function requestFullScreen (): void {
  document.getElementById('app')?.requestFullscreen()
}
</script>
