<template>
  <win-window ref="window" :width="440" fluidHeight name="ratings" title="Ratings">
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
              <tr v-for="(chart, i) in charts" class="hover">
                <td class="text-center noselect" style="width: 37px">{{ pad((page - 1) * perPage + i + 1) }}
                </td>
                <td class="py-1 show-info" @click="songInfo(chart.id)">
                  <div class="artist">{{ chart.artist }}</div>
                  <div class="title">{{ chart.title }}</div>
                </td>
                <td v-if="range !== 'overtime'" class="text-right noselect pr-2 nowrap" style="width: 57px">
                  {{ chart.likes }}<i class="i icon-like ml-1" style="color: #c12727"/></td>
              </tr>
            </win-list>
          </div>
        </div>

        <!-- List footer buttons -->
        <div class="d-flex">
          <div class="row no-gutters mt-2 w-100">
            <div class="col">
              <win-pagination ref="pagination" :pages="pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="window.close()">Close</win-btn>
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
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ratings } from '@common/js/api/api'
import windowsComposable from '@common/js/composables/windowsComposable'

// Composable
const { alert, songInfo } = windowsComposable()

const window = ref('window')
// Reactive data
const loading = ref(true)
const charts = ref([])
const total = ref(0)
const perPage = ref(25)
const pages = ref(4)
const page = ref(1)
const range = ref('overtime')

// Refs
const list = ref(null)
const pagination = ref(null)

watch(range, () => {
  page.value = 1
  pagination.value.reset()
  fetchRatings(range.value, page.value)
})

watch(page, () => {
  fetchRatings(range.value, page.value)
})

// Methods
function fetchRatings (range, page) {
  list.value.scrollTop()

  ratings.get(range, page).then(res => {
    perPage.value = res.data.per_page
    pages.value = res.data.pages
    charts.value = res.data.songs
    total.value = res.data.count
    list.value.refreshScrollbar()
  }).catch(err => alert(err.response.data.error, 'Error')).finally(() => loading.value = false)
}

function changePage (newPage) {
  if (!loading.value) {
    page.value = newPage
  }
}

function changeRange (newRange) {
  if (!loading.value) {
    range.value = newRange
  }
}

function pad (s) {
  return s.toString().padStart(3, '0')
}

onMounted(() => {
  fetchRatings(range.value, page.value)
})

onBeforeUnmount(() => {
  charts.value = []
})
</script>
