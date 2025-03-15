<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="openWindow(WinType.ABOUT)">{{ t('menu.about') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="openWindow(WinType.HISTORY)">{{ t('menu.play_history') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="openWindow(WinType.RATINGS)">{{ t('menu.ratings') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="openWindow(WinType.SUPPORT)">{{ t('menu.support_us') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'

const { t } = useI18n()
const { openWindow, WinType } = useWindows()
</script>
