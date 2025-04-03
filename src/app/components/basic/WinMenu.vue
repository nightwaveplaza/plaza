<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="openWindow(Win.ABOUT)">{{ t('menu.about') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="openWindow(Win.HISTORY)">{{ t('menu.play_history') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="openWindow(Win.RATINGS)">{{ t('menu.ratings') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="openWindow(Win.SUPPORT)">{{ t('menu.support_us') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'

const { t } = useI18n()
const { openWindow } = useWindows()
</script>
