<template>
  <div class="flex-grow-1 h-100">
    <div class="p-2 h-100">
      <div class="d-flex flex-column h-100">
        <div class="d-flex mb-1">
          <div class="row no-gutters w-100">
            <div v-if="history?.data" class="col">
              {{ t('win.history.showing_history', {from: fmtDay(history.date_range.from_date), to: fmtDay(history.date_range.to_date)}) }}
            </div>
            <div class="col-auto">
              <a href="https://plaza.one/lastfm" target="_blank">Last.fm</a>
            </div>
          </div>
        </div>

        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="isLoading" class="content-loading" />
          <win-list v-else ref="list" scroll>
            <tr v-for="h in history?.data" :key="h.song.id">
              <td class="pr-1 py-1 show-info" @click="showSongInfo(h.song.id)">
                <div class="artist">
                  {{ h.song.artist }}
                </div>
                <div class="title">
                  {{ h.song.title }}
                </div>
              </td>
              <td class="text-right noselect" style="width: 78px">
                {{ fmtDay(h.played_at) }}<br>
                {{ fmtTime(h.played_at) }}
              </td>
            </tr>
          </win-list>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination
                v-if="history && history?.meta.total > 0"
                :pages="history.meta.last_page"
                :disabled="isLoading"
                @change="changePage"
              />
            </div>
            <div class="col-auto">
              <win-button class="px-4" @click="closeWindow(Win.HISTORY)">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="win-window__statusbar noselect">
    <div class="row no-gutters">
      <div class="col-3 cell d">
        {{ history ? t('pagination.pages', {n: history?.meta.last_page}) : '...' }}
      </div>
      <div class="col cell">
        {{ history ? t('pagination.songs', {n: history.meta.total}) : '...' }}
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type WinList from '@app/components/basic/WinList.vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useHistoryApi } from '@app/composables/api'
import { fmtDay, fmtTime } from '@app/utils/timeFormats.ts'
import { Win } from '@app/types'

const { t } = useI18n()
const { showAlert, showSongInfo, closeWindow } = useWindows()
const { getHistory } = useHistoryApi()

const page = ref(1)
const { isLoading, fetch, data: history, error } = getHistory()
const list = ref<InstanceType<typeof WinList>>()

function changePage (newPage: number): void {
  page.value = newPage
  fetchHistory()
}

function fetchHistory (): void {
  fetch({ page: page.value })
}

watch(() => error.value, (error) => {
  if (error) {
    showAlert(error.message, t('errors.error'))
  }
})

onMounted(() => {
  fetchHistory()
})
</script>
