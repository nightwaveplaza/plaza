<template>
  <win-window v-slot="winProps" :width="450" fluid-height name="user-favorites" :title="t('win.user_favorites.title')">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading noselect" />

            <win-list ref="list" scroll>
              <template v-if="data.favorites.length > 0 && !loading">
                <table>
                  <tr v-for="(fav, i) in data.favorites" :key="i" :class="{ strike: deleted.includes(fav.id) }" class="hover">
                    <td class="p-1 noselect" style="width: 62px">
                      <img :src="fav.song.artwork_src ? fav.song.artwork_src : 'https://i.plaza.one/dead.jpg'" alt="artwork">
                    </td>
                    <td class="pl-1 show-info" @click="windowsStore.showSong(fav.song.id)">
                      <div class="artist">
                        {{ fav.song.artist }}
                      </div>
                      <div class="title">
                        {{ fav.song.title }}
                      </div>
                      <div class="date">
                        <i>{{ sdy(fav.created_at) }}</i>
                      </div>
                    </td>
                    <td class="text-center noselect" style="width: 70px">
                      <a v-if="!deleted.includes(fav.id)" class="link favorites-remove"
                         role="button"
                         @click="deleteLike(fav.id)"
                      >{{ t('win.user_favorites.remove') }}</a>
                    </td>
                  </tr>
                </table>
                <div class="ps__rail-y noselect" style="display: block;top: 0;right: 0;height: 100%;" />
              </template>

              <div v-else-if="!loading" class="favorites-empty noselect">
                <i18n-t keypath="win.user_favorites.list_empty" tag="i">
                  <template #icon>
                    <i class="i icon-like" />
                  </template>
                </i18n-t>
              </div>
            </win-list>
          </div>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination :pages="data.pages" @change="changePage" />
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

    <div class="statusbar row no-gutters song-list-statusbar noselect">
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
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@app/api/api'
import helperComposable from '@app/composables/helperComposable'
import { useWindowsStore } from '@app/stores/windowsStore'
import type WinWindow from '@app/components/basic/WinWindow.vue'
import type WinList from '@app/components/basic/WinList.vue'
import type { FavoritesResponse } from '@app/types/types'

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

function fetchLikes (page: number): void {
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

function changePage (newPage: number): void {
  if (loading.value) {
    return
  }

  page.value = newPage
  fetchLikes(newPage)
}

function deleteLike (favoriteId: number): void {
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
