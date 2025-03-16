<template>
  <win-window v-slot="winProps" :width="400" fluid-height :name="name" :title="t('win.history.title')">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex mb-1">
          <div class="row no-gutters w-100">
            <div v-if="data.songs.length > 0" class="col">
              {{ t('win.history.showing_history', {from: fmtDay(data.from_date), to: fmtDay(data.to_date)}) }}
            </div>
            <div class="col-auto">
              <a href="https://plaza.one/lastfm" target="_blank">Last.fm</a>
            </div>
          </div>
        </div>

        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="loading" class="content-loading" />
          <win-list v-else ref="list" scroll>
            <tr v-for="song in data.songs" :key="song.id">
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
              <win-pagination v-if="data.songs.length > 0" :pages="data.pages" @change="changePage" />
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
        {{ t('pagination.pages', {n: data.pages}) }}
      </div>
      <div class="col cell">
        {{ t('pagination.songs', {n: data.count}) }}
      </div>
    </div>
  </win-window>
</template>


<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@app/api/api'
import type WinList from '@app/components/basic/WinList.vue'
import type { HistoryResponse } from '@app/types/types'
import { useApiError } from '@app/composables/useApiError.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useTimeFormats } from '@app/composables/useTimeFormats.ts'

const { t } = useI18n()
const { fmtDay, fmtTime } = useTimeFormats()
const { winAlert, winSongInfo } = useWindows()

defineProps<{
  name: string
}>()

const data: HistoryResponse = reactive({
  per_page: 25,
  pages: 4,
  songs: [],
  count: 0,
  from_date: 0,
  to_date: 0
})

const loading = ref(true)
const page = ref(1)
const list = ref<InstanceType<typeof WinList>>()

function changePage (newPage: number): void {
  if (!loading.value) {
    page.value = newPage
  }
}

async function fetchHistory (page: number): Promise<void> {
  loading.value = true

  api.history.get(page).then(res => {
    Object.assign(data, res.data)
  }).catch(e => {
    winAlert(useApiError(e), t('errors.error'))
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      list.value?.scrollTop()
    })
  })
}

watch(page, () => {
  fetchHistory(page.value)
})

onMounted(() => {
  fetchHistory(page.value)
})

onBeforeUnmount(() => {
  data.songs = []
})
</script>
