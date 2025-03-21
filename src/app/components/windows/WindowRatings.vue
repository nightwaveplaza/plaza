<template>
  <win-window v-slot="winProps" :width="440" fluid-height :name="name" :title="t('win.ratings.title')">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <!-- Range buttons -->
        <div class="d-flex mb-1">
          <win-button :class="{ active: range === 'overtime' }" class="songs-range mr-1" @click="changeRange('overtime')">
            {{ t('win.ratings.btn_overtime') }}
          </win-button>
          <win-button :class="{ active: range === 'monthly' }" class="songs-range mr-1" @click="changeRange('monthly')">
            {{ t('win.ratings.btn_monthly') }}
          </win-button>
          <win-button :class="{ active: range === 'weekly' }" class="songs-range mr-0" @click="changeRange('weekly')">
            {{ t('win.ratings.btn_weekly') }}
          </win-button>
        </div>

        <!-- Song list -->
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="loading" class="content-loading" />
          <win-list v-else ref="list" scroll>
            <tr v-for="(song, i) in data.songs" :key="i" class="hover">
              <td class="text-center noselect" style="width: 37px">
                {{ pad((page - 1) * data.per_page + i + 1) }}
              </td>
              <td class="py-1 show-info" @click="winSongInfo(song.id)">
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

        <!-- List footer buttons -->
        <div class="d-flex">
          <div class="row no-gutters mt-2 w-100">
            <div class="col">
              <win-pagination ref="pagination" :pages="data.pages" @change="changePage" />
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
import { api } from '@app/api/api'
import WinWindow from '@app/components/basic/WinWindow.vue'
import type WinList from '@app/components/basic/WinList.vue'
import type WinPagination from '@app/components/basic/WinPagination.vue'
import type { RatingsResponse } from '@app/types/types'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@app/composables/useApiError.ts'
import { useWindows } from '@app/composables/useWindows.ts'

const { t } = useI18n()
const { winAlert, winSongInfo } = useWindows()

const list = ref<InstanceType<typeof WinList>>()
const pagination = ref<InstanceType<typeof WinPagination>>()

defineProps<{
  name: string
}>()

const data: RatingsResponse = reactive({
  per_page: 25,
  pages: 4,
  songs: [],
  count: 0
})

const page = ref(1)
const range = ref('overtime')
const loading = ref(true)

function fetchRatings (range: string, page: number): void {
  loading.value = true

  api.ratings.get(range, page).then(res => {
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

function changePage (newPage: number): void {
  if (!loading.value) {
    page.value = newPage
  }
}

function changeRange (newRange: string): void {
  if (!loading.value) {
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

<style lang="scss">
#window-ratings {
  .list {
    table {
      .icon-heart {
        text-shadow: none;
        opacity: 0.8;
        color: #B22222;

        &:before {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
