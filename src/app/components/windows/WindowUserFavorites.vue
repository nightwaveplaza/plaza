<template>
  <win-window v-slot="winProps" :width="450" fluid-height :name="name" :title="t('win.user_favorites.title')">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="isLoading" class="content-loading noselect" />
          <win-list v-else ref="list" scroll>
            <template v-if="favs?.data && !isLoading">
              <tr v-for="(f, i) in favs.data" :key="i" :class="{ strike: deleted.includes(f.id) }" class="hover">
                <td class="p-1 noselect" style="width: 62px">
                  <img :src="f.song.artwork_src" alt="artwork">
                </td>
                <td class="pl-1 show-info" @click="winSongInfo(f.song.id)">
                  <div class="artist">
                    {{ f.song.artist }}
                  </div>
                  <div class="title">
                    {{ f.song.title }}
                  </div>
                  <div class="date">
                    <i>{{ fmtDate(f.created_at) }}</i>
                  </div>
                </td>
                <td class="text-center noselect" style="width: 70px">
                  <a v-if="!deleted.includes(f.id)" class="link favorites-remove"
                     role="button"
                     @click="deleteLike(f.id)"
                  >{{ t('win.user_favorites.remove') }}</a>
                </td>
              </tr>
              <div class="ps__rail-y noselect" style="display: block;top: 0;right: 0;height: 100%;" />
            </template>

            <div v-else-if="!isLoading" class="favorites-empty noselect">
              <i18n-t keypath="win.user_favorites.list_empty" tag="i">
                <template #icon>
                  <i class="i icon-like" />
                </template>
              </i18n-t>
            </div>
          </win-list>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination
                :pages="favs?.meta.last_page"
                :disabled="isLoading"
                @change="changePage"
              />
            </div>
            <div class="col-auto">
              <win-button class="px-3 mr-2" @click="openWindow(Win.USER_FAVORITES_EXPORT)">
                {{ t('win.user_favorites_export.btn_export') }}
              </win-button>
              <win-button class="px-3" @click="winProps.close()">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters song-list-statusbar noselect">
      <div class="col-3 cell d">
        {{ t('pagination.pages', {n: favs?.meta.last_page}) }}
      </div>
      <div class="col cell">
        {{ t('pagination.songs', {n: favs?.meta.total}) }}
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { fmtDate } from '@app/utils/timeFormats.ts'
import { useUserFavoritesApi } from '@app/composables/api'
import { Win } from '@app/types'

const { t } = useI18n()
const { winAlert, winSongInfo, openWindow } = useWindows()
const { getFavorites, deleteFavorite } = useUserFavoritesApi()
const { isLoading, fetch, data: favs, error } = getFavorites()

defineProps<{
  name: string,
}>()

const deleted = ref([] as Array<number>)
const page = ref(1)

function fetchFavorites (): void {
  fetch({ page: page.value })
}

function changePage (newPage: number): void {
  page.value = newPage
  fetchFavorites()
}

function deleteLike (favoriteId: number): void {
  deleteFavorite().fetch({ id: favoriteId }).then(() => {
    deleted.value.push(favoriteId)
  }).catch(e => {
    winAlert(e.message, t('errors.error'))
  })
}

watch(() => error.value, (error) => {
  if (error) {
    winAlert(error.message, t('errors.error'))
  }
})

onMounted(() => {
  fetchFavorites()
})
</script>

<style lang="scss">
#window-user-favorites {
  .favorites-empty {
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    padding-top: 15px;
    text-align: center;
    background: white;
  }

  .date {
    font-size: 10px;
    opacity: 0.8;
  }
}
</style>

