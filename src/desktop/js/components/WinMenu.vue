<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="windowsStore.open('about')">{{ t('menu.about') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="windowsStore.open('history')">{{ t('menu.play_history') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="windowsStore.open('ratings')">{{ t('menu.ratings') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="windowsStore.open('support')">{{ t('menu.support_us') }}</a>
        </div>
        <div class="action">
          <a role="button" tabindex="4" @click="windowsStore.open('mobile')">{{ t('menu.mobile') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const { t } = useI18n()
const windowsStore = useWindowsStore()
</script>
