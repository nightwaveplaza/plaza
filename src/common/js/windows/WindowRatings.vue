<template>
  <win-window v-slot="winProps" :width="440" fluid-height name="ratings" :title="t('win.ratings.title')">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <!-- Range buttons -->
        <div class="d-flex mb-1">
          <win-btn :class="{ active: range === 'overtime' }" class="songs-range mr-1" @click="changeRange('overtime')">
            {{ t('win.ratings.btn_overtime') }}
          </win-btn>
          <win-btn :class="{ active: range === 'monthly' }" class="songs-range mr-1" @click="changeRange('monthly')">
            {{ t('win.ratings.btn_monthly') }}
          </win-btn>
          <win-btn :class="{ active: range === 'weekly' }" class="songs-range mr-0" @click="changeRange('weekly')">
            {{ t('win.ratings.btn_weekly') }}
          </win-btn>
        </div>

        <!-- Song list -->
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading" />
            <win-list ref="list" scroll>
              <tr v-for="(song, i) in data.songs" :key="i" class="hover">
                <td class="text-center noselect" style="width: 37px">
                  {{ pad((page - 1) * data.per_page + i + 1) }}
                </td>
                <td class="py-1 show-info" @click="windowsStore.showSong(song.id)">
                  <div class="artist">
                    {{ song.artist }}
                  </div>
                  <div class="title">
                    {{ song.title }}
                  </div>
                </td>
                <td v-if="range !== 'overtime'" class="text-right noselect pr-2 nowrap" style="width: 57px">
                  {{ song.likes }}<i class="i icon-like ml-1" style="color: #c12727" />
                </td>
              </tr>
            </win-list>
          </div>
        </div>

        <!-- List footer buttons -->
        <div class="d-flex">
          <div class="row no-gutters mt-2 w-100">
            <div class="col">
              <win-pagination ref="pagination" :pages="data.pages" @change="changePage" />
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="winProps.close()">
                {{ t('buttons.close') }}
              </win-btn>
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
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { api } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import type WinList from '@common/js/components/WinList.vue'
import type WinPagination from '@common/js/components/WinPagination.vue'
import type { RatingsResponse } from '@common/js/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const windowsStore = useWindowsStore()

const list = ref<InstanceType<typeof WinList>>()
const pagination = ref<InstanceType<typeof WinPagination>>()

const data: RatingsResponse = reactive({
  per_page: 25,
  pages: 4,
  songs: [],
  count: 0
})

const page = ref(1)
const range = ref('overtime')

let loading = false

function fetchRatings (range: string, page: number): void {
  list.value!.scrollTop()

  api.ratings.get(range, page).then(res => {
    Object.assign(data, res.data)
    list.value!.refreshScrollbar()
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  }).finally(() => loading = false)
}

function changePage (newPage: number): void {
  if (!loading) {
    page.value = newPage
  }
}

function changeRange (newRange: string): void {
  if (!loading) {
    range.value = newRange
  }
}

function pad (n: number): string {
  return n.toString().padStart(3, '0')
}

watch(range, () => {
  page.value = 1
  pagination.value!.reset()
  fetchRatings(range.value, page.value)
})

watch(page, () => {
  fetchRatings(range.value, page.value)
})

onMounted(() => {
  fetchRatings(range.value, page.value)
})

onBeforeUnmount(() => {
  data.songs = []
})
</script>
