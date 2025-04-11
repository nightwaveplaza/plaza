<template>
  <win-window v-slot="winProps" :width="300" :name="name" :title="t('win.user_favorites.title')">
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
        <win-button class="px-3 mx-auto" @click="winProps.close()">
          {{ t('buttons.close') }}
        </win-button>
      </div>

    </div>
  </win-window>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserFavoritesApi } from '@app/composables/api'

const { t } = useI18n()
const { exportFavorites } = useUserFavoritesApi()
const { isLoading, fetch, data } = exportFavorites()

defineProps<{
  name: string,
}>()

function startExport (): void {
  fetch()
}
</script>
