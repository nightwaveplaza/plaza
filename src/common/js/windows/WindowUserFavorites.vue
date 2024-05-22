<template>
  <win-window :width="450" fluidHeight name="user-favorites" :title="t('win.user_favorites.title')" v-slot="winProps">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading noselect"></div>

            <win-list scroll ref="list">
              <template v-if="data.favorites.length > 0 && !loading">
                <table>
                  <tr v-for="(fav, i) in data.favorites" :class="{ strike: deleted.includes(fav.id) }" class="hover">
                    <td class="p-1 noselect" style="width: 62px">
                      <img :src="fav.song.artwork_src ? fav.song.artwork_src : 'https://i.plaza.one/dead.jpg'"
                           alt="artwork"/>
                    </td>
                    <td class="pl-1 show-info" @click="windowsStore.showSong(fav.song.id)">
                      <div class="artist">{{ fav.song.artist }}</div>
                      <div class="title">{{ fav.song.title }}</div>
                      <div class="date">
                        <i>{{ sdy(fav.created_at) }}</i>
                      </div>
                    </td>
                    <td class="text-center noselect" style="width: 70px">
                      <a v-if="!deleted.includes(fav.id)" class="link favorites-remove"
                         role="button"
                         @click="deleteLike(fav.id)">{{ t('win.user_favorites.remove') }}</a>
                    </td>
                  </tr>
                </table>
                <div class="ps__rail-y noselect" style="display: block;top: 0;right: 0;height: 100%;"></div>
              </template>

              <div v-else-if="!loading" class="favorites-empty noselect">
                <i18n-t keypath="win.user_favorites.list_empty" tag="i">
                  <template #icon>
                    <i class="i icon-like"></i>
                  </template>
                </i18n-t>
              </div>
            </win-list>

          </div>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination :pages="data.pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="winProps.close()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters song-list-statusbar noselect">
      <div class="col-3 cell d">{{ t('pagination.pages', {n: data.pages}) }}</div>
      <div class="col cell">{{ t('pagination.songs', {n: data.count}) }}</div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import WinWindow from '@common/js/components/WinWindow.vue'
import WinList from '@common/js/components/WinList.vue'
import type { FavoritesResponse } from '@common/js/types'

const { t } = useI18n()
const windowsStore = useWindowsStore()
const { sdy } = helperComposable()

const data: FavoritesResponse = reactive({
  per_page: 25,
  pages: 4,
  count: 0,
  favorites: [],
})

const loading = ref(true)
const deleted = ref([] as Array<number>)
const page = ref(1)

const list = ref<InstanceType<typeof WinList>>()

function fetchLikes (page: number) {
  list.value!.scrollTop()
  loading.value = true

  api.user.favorites(page).then(res => {
    Object.assign(data, res.data)
    loading.value = false
    list.value!.refreshScrollbar()
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  }).finally(() => {
    loading.value = false
  })
}

function changePage (newPage: number) {
  if (loading.value) {
    return
  }

  page.value = newPage
  fetchLikes(newPage)
}

function deleteLike (favoriteId: number) {
  api.user.deleteFavorite(favoriteId).then(() => {
    deleted.value.push(favoriteId)
  }).catch(e => {
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
  })
}

onMounted(() => {
  fetchLikes(page.value)
})

</script>
