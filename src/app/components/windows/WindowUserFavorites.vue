<template>
  <div class="flex-grow-1 h-100">
    <div class="p-2 h-100">
      <div class="d-flex flex-column h-100">
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div v-if="isLoading" class="content-loading" />
          <win-list v-else ref="list" scroll>
            <template v-if="favs?.data && !isLoading">
              <tr
                v-for="(f, i) in favs.data"
                :key="i"
                :class="{ strike: deleted.includes(f.id) }"
                class="hover"
              >
                <td class="p-1 ps-0" style="width: 62px">
                  <img :src="f.song.artwork_src" alt="artwork" />
                </td>
                <td class="ps-1 show-info" @click="showSongInfo(f.song.id)">
                  <p class="mb-0">
                    <strong>{{ f.song.artist }}</strong>
                  </p>
                  <div class="title">
                    <p class="mb-0">{{ f.song.title }}</p>
                  </div>
                  <div class="date">
                    <p class="mb-0">
                      <i>{{ fmtDate(f.created_at) }}</i>
                    </p>
                  </div>
                </td>
                <td class="text-center" style="width: 70px">
                  <a
                    v-if="!deleted.includes(f.id)"
                    class="link favorites-remove"
                    role="button"
                    @click="deleteLike(f.id)"
                    >{{ t('win.user_favorites.remove') }}</a
                  >
                </td>
              </tr>
              <div class="ps__rail-y" style="display: block; top: 0; right: 0; height: 100%" />
            </template>

            <div v-else-if="!isLoading" class="favorites-empty">
              <i18n-t keypath="win.user_favorites.list_empty" tag="i">
                <template #icon>
                  <i class="i icon-like" />
                </template>
              </i18n-t>
            </div>
          </win-list>
        </div>

        <div class="d-flex">
          <div class="row gx-0 pt-2 w-100">
            <div class="col">
              <win-pagination
                :pages="favs?.meta.last_page"
                :disabled="isLoading"
                @change="changePage"
              />
            </div>
            <div class="col-auto">
              <win-button class="px-3 me-2" @click="openWindow(Win.USER_FAVORITES_EXPORT)">
                {{ t('win.user_favorites_export.btn_export') }}
              </win-button>
              <win-button class="px-3" @click="closeWindow(Win.USER_FAVORITES)">
                {{ t('buttons.close') }}
              </win-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="win-window__statusbar">
    <div class="row gx-0 song-list-statusbar">
      <div class="col-auto cell pe-4 d">
        {{ t('pagination.pages', { n: favs?.meta.last_page }) }}
      </div>
      <div class="col cell">
        {{ t('pagination.songs', { n: favs?.meta.total }) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { fmtDate } from '@app/utils/timeFormats.ts';
  import { Win } from '@app/types';
  import { useApi } from '@app/composables/useApi.ts';
  import { userFavoritesApi } from '@app/api/userFavorites.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';
  import { useAuth } from '@app/composables/useAuth.ts';

  const { t } = useI18n();
  const { isSigned } = useAuth();
  const { showAlert, showSongInfo, openWindow, closeWindow } = useWindows();
  const { execute: getFavorites, isLoading, data: favs } = useApi(userFavoritesApi.getFavorites);
  const { execute: deleteFavorite } = useApi(userFavoritesApi.deleteFavorite);

  const deleted = ref([] as Array<number>);
  const page = ref(1);

  async function fetchFavorites() {
    try {
      await getFavorites({ page: page.value });
    } catch (e) {
      showAlert((e as ApiError).message, t('errors.error'));
    }
  }

  function changePage(newPage: number) {
    page.value = newPage;
    fetchFavorites();
  }

  async function deleteLike(favoriteId: number) {
    try {
      await deleteFavorite({ id: favoriteId });
    } catch (e) {
      showAlert((e as ApiError).message, t('errors.error'));
    }
  }

  onBeforeMount(() => {
    if (!isSigned.value) {
      closeWindow(Win.USER_FAVORITES);
      openWindow(Win.USER_LOGIN);
    }
  });

  onMounted(() => {
    fetchFavorites();
  });
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
