<template>
  <div class="flex-grow-1 h-100">
    <div class="p-2 h-100">
      <div class="d-flex flex-column h-100">
        <!-- Range buttons -->
        <div class="d-flex mb-1">
          <win-button
            :class="{ active: range === RatingsRange.OVERTIME }"
            class="me-1 px-2"
            @click="changeRange(RatingsRange.OVERTIME)"
          >
            {{ t('win.ratings.btn_overtime') }}
          </win-button>
          <win-button
            :class="{ active: range === RatingsRange.MONTHLY }"
            class="me-1 px-2"
            @click="changeRange(RatingsRange.MONTHLY)"
          >
            {{ t('win.ratings.btn_monthly') }}
          </win-button>
          <win-button
            :class="{ active: range === RatingsRange.WEEKLY }"
            class="me-0 px-2"
            @click="changeRange(RatingsRange.WEEKLY)"
          >
            {{ t('win.ratings.btn_weekly') }}
          </win-button>
        </div>

        <!-- Song list -->
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="isLoading" class="content-loading" />
          <win-list v-if="!isLoading && songs" scroll>
            <tr v-for="(s, i) in songs.data" :key="i" class="hover">
              <td style="width: 25px">
                {{ pad((page - 1) * songs.meta.per_page + i + 1) }}
              </td>
              <td class="ps-1 py-1 show-info" @click="showSongInfo(s.song.id)">
                <p class="mb-0">
                  <strong>{{ s.song.artist }}</strong>
                </p>
                <p class="mb-0">
                  {{ s.song.title }}
                </p>
              </td>
              <td class="text-end nowrap" style="width: 57px">
                {{ s.likes }}<i class="i icon-like ms-1" style="color: #c12727" />
              </td>
            </tr>
          </win-list>
        </div>

        <!-- List footer buttons -->
        <div class="d-flex">
          <div class="row gx-0 mt-2 w-100">
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
              <win-button class="px-4" @click="closeWindow(Win.RATINGS)">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="win-window__statusbar">
    <div class="row gx-0">
      <div class="col-auto cell pe-4 d">
        {{ songs ? t('pagination.pages', { n: songs?.meta.last_page }) : '...' }}
      </div>
      <div class="col cell">
        {{ songs ? t('pagination.songs', { n: songs.meta.total }) : '...' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import type WinPagination from '@app/components/basic/WinPagination.vue';
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { RatingsRange, Win } from '@app/types';
  import { useApi } from '@app/composables/useApi.ts';
  import { ratingsApi } from '@app/api/ratings.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { showAlert, showSongInfo, closeWindow } = useWindows();
  const { execute: getRatings, isLoading, data: songs } = useApi(ratingsApi.getRatings);

  const page = ref(1);
  const range = ref<RatingsRange>(RatingsRange.OVERTIME);
  const pagination = ref<InstanceType<typeof WinPagination>>();

  function changePage(newPage: number): void {
    page.value = newPage;
    fetchRatings();
  }

  function changeRange(newRange: RatingsRange): void {
    range.value = newRange;
    pagination.value?.reset();
  }

  async function fetchRatings(): Promise<void> {
    try {
      await getRatings({ page: page.value }, range.value);
    } catch (e) {
      showAlert((e as ApiError).message, t('errors.error'));
    }
  }

  function pad(n: number): string {
    return n.toString().padStart(3, '0');
  }

  onMounted(() => {
    fetchRatings();
  });
</script>

<style lang="scss">
  #window-ratings {
    .win-list {
      table {
        .icon-heart {
          text-shadow: none;
          opacity: 0.8;
          color: #b22222;

          &:before {
            font-size: 11px;
          }
        }
      }
    }
  }
</style>
