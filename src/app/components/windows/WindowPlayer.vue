<template>
  <win-window ref="win" :name="name" title="Nightwave Plaza" :width="450">
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

    <template #default>
      <!-- Menu -->
      <win-menu v-if="!isMobile()">
        <win-menu-action @click="openWindow(Win.ABOUT)">
          {{ t('menu.about') }}
        </win-menu-action>
        <win-menu-action @click="openWindow(Win.HISTORY)">
          {{ t('menu.play_history') }}
        </win-menu-action>
        <win-menu-action @click="openWindow(Win.RATINGS)">
          {{ t('menu.ratings') }}
        </win-menu-action>
        <win-menu-action @click="openWindow(Win.SUPPORT)">
          {{ t('menu.support_us') }}
        </win-menu-action>
      </win-menu>

      <!-- Player -->
      <div class="content p-2">
        <win-player :volume="volume" @update-volume="setVolume" />
      </div>
    </template>

    <!-- Statusbar -->
    <template #statusbar>
      <div class="row no-gutters">
        <div class="col cell">
          {{ t('win.player.listeners', { listeners }) }}
        </div>
        <div v-if="isSigned" class="col-5 col-sm-4 cell login">
          {{ t('win.player.user', {user: user?.username }) }}
        </div>
      </div>
    </template>
  </win-window>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import WinWindow from '@app/components/basic/WinWindow.vue'
import { isMobile } from '@app/utils/helpers.ts'
import { Native } from '@mobile/bridge/native.ts'
import { useVolumeControl } from '@app/composables/player/useVolumeControl.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { useAuth } from '@app/composables/useAuth.ts'
import { Win } from '@app/types'

const { t } = useI18n()
const { volume, setVolume } = useVolumeControl()
const { minimizeWindow, openWindow } = useWindows()
const { listeners } = useNowPlayingStatus()
const { user, isSigned } = useAuth()

defineProps<{
  name: string
}>()

const fullScreenEnabled = computed(() => isMobile() || document.fullscreenEnabled)
const win = ref<InstanceType<typeof WinWindow>>()

function minimize (): void {
  minimizeWindow(Win.PLAYER)
}

function requestFullScreen (): void {
  if (isMobile()) {
    Native.toggleFullscreen()
  } else {
    document.getElementById('app')?.requestFullscreen()
  }
}
</script>

<style lang="scss">
#window-player {
  .player-artist {
    margin-top: 2px;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
  }

  .player-title {
    font-size: 14px;
    line-height: 100%;
  }

  .cover {
    background: #efe6eb;
    padding: 0;
    line-height: 0;
    //height: auto;
    width: 112px;
    cursor: pointer;
    background-size: cover;
  }

  .player-time-container {
    margin: 6px 0 3px 0;
    position: relative;
  }

  .player-time {
    position: relative;
    z-index: 2;
    line-height: 24px;
    font-size: 14px;
    text-align: center;
  }

  .player-button i, .player-button span {
    cursor: pointer;
  }

  .player-visual {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    position: absolute;
  }
}

@media (max-width: 500px) {
  .cover {
    width: 100% !important;
  }

  .player-meta {
    text-align: center;
  }

  #window-player .win-window {
    width: 90% !important;
  }
}
</style>
