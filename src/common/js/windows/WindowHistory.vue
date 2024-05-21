<template>
  <win-window :width="400" fluidHeight name="history" :title="t('win.history.title')" v-slot="winProps">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex mb-1">
          <div class="row no-gutters w-100">
            <div v-if="data.songs.length > 0" class="col">
              {{ t('win.history.showing_history', {from: sd(data.from_date), to: sd(data.to_date)}) }}
            </div>
            <div class="col-auto"><a href="https://plaza.one/lastfm" target="_blank">Last.fm</a></div>
          </div>
        </div>

        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading"></div>
            <win-list ref="list" scroll>
              <tr v-for="song in data.songs">
                <td class="pl-2 pr-1 py-1 show-info" @click="windowsStore.showSong(song.id)">
                  <div class="artist">{{ song.artist }}</div>
                  <div class="title">{{ song.title }}</div>
                </td>
                <td class="pr-2 text-right noselect" style="width: 48px">
                  {{ sd(song.played_at) }}<br/>
                  {{ gt(song.played_at) }}
                </td>
              </tr>
            </win-list>
          </div>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination v-if="data.songs.length > 0" :pages="data.pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="winProps.close()">{{ t('buttons.close') }}</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters noselect">
      <div class="col-3 cell d">{{ t('pagination.pages', {n: data.pages}) }}</div>
      <div class="col cell">{{ t('pagination.songs', {n: data.count}) }}</div>
    </div>
  </win-window>
</template>


<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import { api } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import type WinList from '@common/js/components/WinList.vue'
import type { HistoryResponse } from '@common/js/types'

const { t } = useI18n()
const windowsStore = useWindowsStore()
const { sd, gt } = helperComposable()

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

function changePage (newPage: number) {
  if (!loading.value) {
    page.value = newPage
  }
}

async function fetchHistory (page: number) {
  list.value!.scrollTop()
  loading.value = true

  api.history.get(page).then(res => {
    Object.assign(data, res.data)
    list.value!.refreshScrollbar()
  }).catch(e => {
    windowsStore.alert(
        t('alert.error.message', {error: (e as Error).message}),
        t('alert.error.title')
    )
  }).finally(() => {
    loading.value = false
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
