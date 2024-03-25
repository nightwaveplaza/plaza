<template>
  <win-window :width="440" fluidHeight name="ratings" title="Ratings" v-slot="winProps">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <!-- Range buttons -->
        <div class="d-flex mb-1">
          <win-btn :class="{ active: range === 'overtime' }" class="songs-range mr-1" @click="changeRange('overtime')">
            Overtime
          </win-btn>
          <win-btn :class="{ active: range === 'monthly' }" class="songs-range mr-1" @click="changeRange('monthly')">
            Monthly
          </win-btn>
          <win-btn :class="{ active: range === 'weekly' }" class="songs-range mr-0" @click="changeRange('weekly')">
            Weekly
          </win-btn>
        </div>

        <!-- Song list -->
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading"></div>
            <win-list scroll ref="list">
              <tr v-for="(song, i) in data.songs" class="hover">
                <td class="text-center noselect" style="width: 37px">{{ pad((page - 1) * data.per_page + i + 1) }}
                </td>
                <td class="py-1 show-info" @click="windowsStore.showSong(song.id)">
                  <div class="artist">{{ song.artist }}</div>
                  <div class="title">{{ song.title }}</div>
                </td>
                <td v-if="range !== 'overtime'" class="text-right noselect pr-2 nowrap" style="width: 57px">
                  {{ song.likes }}<i class="i icon-like ml-1" style="color: #c12727"/></td>
              </tr>
            </win-list>
          </div>
        </div>

        <!-- List footer buttons -->
        <div class="d-flex">
          <div class="row no-gutters mt-2 w-100">
            <div class="col">
              <win-pagination ref="pagination" :pages="data.pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="winProps.close()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters noselect">
      <div class="col-3 cell d">Pages: {{ data.pages }}</div>
      <div class="col cell">Songs: {{ data.count }}</div>
    </div>
  </win-window>
</template>


<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ratings } from '@common/js/api/api'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import type WinList from '@common/js/components/WinList.vue'
import type WinPagination from '@common/js/components/WinPagination.vue'
import type { ifcRatingsResponse } from '@common/js/types'

const windowsStore = useWindowsStore()

const data: ifcRatingsResponse = reactive({
  per_page: 25,
  pages: 4,
  songs: [],
  count: 0
})

const loading = ref(true)
const page = ref(1)
const range = ref('overtime')

const list = ref<InstanceType<typeof WinList>>()
const pagination = ref<InstanceType<typeof WinPagination>>()

function fetchRatings (range: string, page: number) {
  list.value!.scrollTop()

  ratings.get(range, page).then(res => {
    data.per_page = res.data.per_page
    data.pages = res.data.pages
    data.songs = res.data.songs
    data.count = res.data.count
    list.value!.refreshScrollbar()
  }).catch(err => windowsStore.alert(err.response.data.error, 'Error')).finally(() => loading.value = false)
}

function changePage (newPage: number) {
  if (!loading.value) {
    page.value = newPage
  }
}

function changeRange (newRange: string) {
  if (!loading.value) {
    range.value = newRange
  }
}

function pad (n: number) {
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
