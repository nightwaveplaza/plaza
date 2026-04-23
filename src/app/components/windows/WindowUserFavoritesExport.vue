<template>
  <div class="p-3">
    <win-panel class="mb-3 text-center px-2 py-3">
      <template v-if="data === null">
        <p class="mb-2">
          {{ t('win.user_favorites_export.description') }}
        </p>
        <win-button v-if="!isLoading" class="px-3 mt-2" @click="startExport">
          {{ t('win.user_favorites_export.btn_export') }}
        </win-button>
        <template v-else>
          <img class="mt-1" src="@app/assets/img/hourglass.gif" style="width:32px" alt="">
        </template>
      </template>

      <template v-if="!isLoading && data">
        <p class="mb-2">
          {{ t('win.user_favorites_export.success') }}
        </p>
        <a :href="data.link" target="_blank">
          {{ t('win.user_favorites_export.btn_download') }}
        </a>
      </template>
    </win-panel>

    <div class="text-center">
      <win-button class="px-3 mx-auto" @click="closeWindow(Win.USER_FAVORITES_EXPORT)">
        {{ t('buttons.close') }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Win } from '@app/types'
import { useWindows } from '@app/composables/useWindows.ts'
import { useApi } from '@app/composables/useApi.ts'
import { userFavoritesApi } from '@app/api/userFavorites.api.ts'

const { t } = useI18n()
const { closeWindow } = useWindows()
const { isLoading, execute, data } = useApi(userFavoritesApi.exportFavorites)

function startExport (): void {
  execute()
}
</script>
