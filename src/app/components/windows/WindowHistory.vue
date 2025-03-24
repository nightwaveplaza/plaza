<template>
  <win-window v-slot="winProps" :width="400" fluid-height :name="name" :title="t('win.history.title')">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex mb-1">
          <div class="row no-gutters w-100">
            <div v-if="history?.data" class="col">
              {{ t('win.history.showing_history', {from: fmtDay(history.meta_extra.from_date), to: fmtDay(history.meta_extra.to_date)}) }}
            </div>
            <div class="col-auto">
              <a href="https://plaza.one/lastfm" target="_blank">Last.fm</a>
            </div>
          </div>
        </div>

        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="isLoading" class="content-loading" />
          <win-list v-else ref="list" scroll>
            <tr v-for="song in history?.data" :key="song.id">
              <td class="pl-2 pr-1 py-1 show-info" @click="winSongInfo(song.id)">
                <div class="artist">
                  {{ song.artist }}
                </div>
                <div class="title">
                  {{ song.title }}
                </div>
              </td>
              <td class="pr-1 text-right noselect" style="width: 78px">
                {{ fmtDay(song.played_at) }}<br>
                {{ fmtTime(song.played_at) }}
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
                  @change="changePage"
                  :disabled="isLoading" />
            </div>
            <div class="col-auto">
              <win-button class="px-4" @click="winProps.close()">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters noselect">
      <div class="col-3 cell d">
        {{ history ? t('pagination.pages', {n: history?.meta.last_page}) : '...' }}
      </div>
      <div class="col cell">
        {{ history ? t('pagination.songs', {n: history.meta.total}) : '...' }}
      </div>
    </div>
  </win-window>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type WinList from '@app/components/basic/WinList.vue'
import { useWindows } from '@app/composables/useWindows.ts'
import { useTimeFormats } from '@app/composables/useTimeFormats.ts'
import { useHistoryApi } from '@app/composables/api/useHistoryApi.ts'

const { t } = useI18n()
const { fmtDay, fmtTime } = useTimeFormats()
const { winAlert, winSongInfo } = useWindows()
const { getHistory } = useHistoryApi()

defineProps<{
  name: string
}>()

const page = ref(1)
const { isLoading, fetch, data: history, error } = getHistory()
const list = ref<InstanceType<typeof WinList>>()

function changePage (newPage: number): void {
  page.value = newPage
  fetchHistory()
}

function fetchHistory() {
  fetch(page.value)
}

watch(() => error.value, (error) => {
  if (error) winAlert(error.message, t('errors.error'))
})

onMounted(() => {
  fetchHistory()
})
</script>
