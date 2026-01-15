<template>
  <win-window :width="440" :height="600" fluid-height :name="name" :title="t('win.ratings.title')">
    <template #default="{ close }">
      <div class="p-2 h-100">
        <div class="d-flex flex-column h-100">
          <!-- Range buttons -->
          <div class="d-flex mb-1">
            <win-button :class="{ active: range === RatingsRange.OVERTIME }" class="songs-range mr-1" @click="changeRange(RatingsRange.OVERTIME)">
              {{ t('win.ratings.btn_overtime') }}
            </win-button>
            <win-button :class="{ active: range === RatingsRange.MONTHLY }" class="songs-range mr-1" @click="changeRange(RatingsRange.MONTHLY)">
              {{ t('win.ratings.btn_monthly') }}
            </win-button>
            <win-button :class="{ active: range === RatingsRange.WEEKLY }" class="songs-range mr-0" @click="changeRange(RatingsRange.WEEKLY)">
              {{ t('win.ratings.btn_weekly') }}
            </win-button>
          </div>

          <!-- Song list -->
          <div class="d-flex flex-grow-1 align-items-stretch">
            <div v-if="isLoading" class="content-loading" />
            <win-list v-if="!isLoading && songs" ref="list" scroll>
              <tr v-for="(s, i) in songs.data" :key="i" class="hover">
                <td class="noselect" style="width: 25px">
                  {{ pad((page - 1) * songs.meta.per_page + i + 1) }}
                </td>
                <td class="py-1 show-info" @click="winSongInfo(s.song.id)">
                  <div class="artist">
                    {{ s.song.artist }}
                  </div>
                  <div class="title">
                    {{ s.song.title }}
                  </div>
                </td>
                <td class="text-right noselect nowrap" style="width: 57px">
                  {{ s.likes }}<i class="i icon-like ml-1" style="color: #c12727" />
                </td>
              </tr>
            </win-list>
          </div>

          <!-- List footer buttons -->
          <div class="d-flex">
            <div class="row no-gutters mt-2 w-100">
              <div class="col">
                <win-pagination
                  v-if="songs && songs?.meta.total > 0"
                  ref="pagination"
                  :pages="songs.meta.last_page"
                  :disabled="isLoading"
                  @change="changePage"
                />
              </div>
              <div class="col-auto">
                <win-button class="px-4" @click="close()">
                  {{ t('buttons.close') }}
                </win-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #statusbar>
      <div class="row no-gutters">
        <div class="col-3 cell d">
          {{ songs ? t('pagination.pages', {n: songs?.meta.last_page}) : '...' }}
        </div>
        <div class="col cell">
          {{ songs ? t('pagination.songs', {n: songs.meta.total}) : '...' }}
        </div>
      </div>
    </template>
  </win-window>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import WinWindow from '@app/components/basic/WinWindow.vue'
import type WinList from '@app/components/basic/WinList.vue'
import type WinPagination from '@app/components/basic/WinPagination.vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useRatingsApi } from '@app/composables/api'
import { RatingsRange } from '@app/types'

const { t } = useI18n()
const { winAlert, winSongInfo } = useWindows()
const { getRatings } = useRatingsApi()

defineProps<{
  name: string
}>()

const page = ref(1)
const range = ref<RatingsRange>(RatingsRange.OVERTIME)
const { isLoading, data: songs, fetch, error } = getRatings()

const list = ref<InstanceType<typeof WinList>>()
const pagination = ref<InstanceType<typeof WinPagination>>()

function changePage (newPage: number): void {
  page.value = newPage
  fetchRatings()
}

function changeRange (newRange: RatingsRange): void {
  range.value = newRange
  pagination.value?.reset()
}

function fetchRatings (): void {
  fetch({ range: range.value }, { page: page.value })
}

function pad (n: number): string {
  return n.toString().padStart(3, '0')
}

watch(() => error.value, (error) => {
  if (error) {
    winAlert(error.message, t('errors.error'))
  }
})

onMounted(() => {
  fetchRatings()
})
</script>

<style lang="scss">
#window-ratings {
  .win-list {
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
