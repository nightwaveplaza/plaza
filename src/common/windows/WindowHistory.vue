<template>
  <win-window ref="window" :width="400" fluidHeight name="history" title="Play History">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex mb-1">
          <div class="row no-gutters w-100">
            <div v-if="items.length > 0" class="col">Showing history: {{ sd(dateFrom) }} &mdash;
              {{ sd(dateTo) }}.
            </div>
            <div class="col-auto"><a href="https://plaza.one/lastfm" target="_blank">Last.fm history</a></div>
          </div>
        </div>

        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading"></div>
            <win-list ref="list" scroll>
              <tr v-for="song in items">
                <td class="pl-2 pr-1 py-1 show-info" @click="songInfo(song.id)">
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
              <win-pagination v-if="items.length > 0" :pages="pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="closeWindow()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters noselect">
      <div class="col-3 cell d">Pages: {{ pages }}</div>
      <div class="col cell">Songs: {{ total }}</div>
    </div>
  </win-window>
</template>


<script setup>
import { history } from '@common/api/api'
import * as dayjs from 'dayjs'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import windowsComposable from '@common/composables/windowsComposable'

// Reactive data
const loading = ref(true)
const items = ref([])
const total = ref(0)
const perPage = ref(25)
const pages = ref(4)
const page = ref(1)
const dateFrom = ref(0)
const dateTo = ref(0)

// Refs
const list = ref(null)
const pagination = ref(null)

// Composable
const { alert2 } = windowsComposable('ratings')

watch(page, () => {
  fetchHistory(page.value)
})

function changePage (newPage) {
  page.value = newPage
}

function fetchHistory (page) {
  list.value.scrollTop()
  loading.value = true

  history.get(page).then(result => {
    perPage.value = result.data.per_page
    pages.value = result.data.pages
    items.value = result.data.songs
    total.value = result.data.count
    loading.value = false
    dateFrom.value = result.data.from_date
    dateTo.value = result.data.to_date
    list.value.refreshScrollbar()
  }).catch(error => {
    alert2(error.response.data.error, 'Error')
  })
}

function gt (date) {
  return dayjs.unix(date).format('HH:mm')
}

onMounted(() => {
  fetchHistory(page.value)
})

onBeforeUnmount(() => {
  items.value = []
})
</script>
