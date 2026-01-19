<template>
  <div class="pt-2 ps-2 pe-2">
    <win-memo>
      <i18n-t keypath="win.credits.created_by" tag="p" class="mb-2">
        <template #app>
          <b>Nightwave Plaza</b>
        </template>
        <template #author>
          <a href="https://discordapp.com/users/104038869388775424" target="_blank">Alexander Morozov</a>
        </template>
      </i18n-t>

      <i18n-t keypath="win.credits.content_by" tag="p">
        <template #content>
          <b>{{ t('win.credits.content') }}</b>
        </template>
      </i18n-t>
    </win-memo>
    <div class="text-center my-2">
      <win-button class="px-4" @click="closeWindow(Win.CREDITS)">
        {{ t('buttons.close') }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Win } from '@app/types'
import { useWindows } from '@app/composables/useWindows.ts'

const { closeWindow } = useWindows()
const { t } = useI18n()
</script>
