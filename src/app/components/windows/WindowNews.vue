<template>
  <div class="p-2">
    <div v-if="isLoading" class="content-loading" style="min-height: 200px" />

    <win-memo v-if="!isLoading">
      <template v-for="article in news?.data" :key="article.id">
        <div v-if="article.text !== ''" v-html="article.text" />
        <div v-if="article.text !== ''" class="row justify-content-between">
          <div class="col-auto">
            {{ article.author }}
          </div>
          <div class="col-auto">
            {{ fmtDate(article.created_at) }}
          </div>
        </div>
      </template>
    </win-memo>

    <!-- Buttons -->
    <div class="row mt-2 gx-0">
      <div class="col">
        <win-pagination
          v-if="news && news.meta.total > 0"
          :pages="news.meta.last_page"
          :disabled="isLoading"
          @change="changePage"
        />
      </div>
      <div class="col-4 ms-auto">
        <win-button class="d-block" @click="closeWindow(Win.NEWS)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows';
  import { fmtDate } from '@app/utils/timeFormats.ts';
  import { Win } from '@app/types';
  import { useApi } from '@app/composables/useApi.ts';
  import { newsApi } from '@app/api/news.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { showAlert } = useWindows();
  const { closeWindow } = useWindows();

  const page = ref(1);
  const { isLoading, data: news, execute: getNews } = useApi(newsApi.getNews);

  function changePage(newPage: number): void {
    page.value = newPage;
    fetchNews();
  }

  async function fetchNews(): Promise<void> {
    try {
      await getNews({ page: page.value });
    } catch (e) {
      showAlert((e as ApiError).message, t('errors.error'));
      closeWindow(Win.NEWS);
    }
  }

  onMounted(() => {
    fetchNews();
  });
</script>

<style lang="scss">
  #window-news {
    .memo {
      position: relative;
      min-height: 100px;
      font-family: monospace, monospace;
      font-size: 11px;

      h2 {
        font-size: 14px;
        line-height: 100%;
        margin-bottom: 8px;
      }

      p {
        margin-bottom: 4px;
      }

      ul {
        margin-left: 16px;
        margin-bottom: 4px;
      }
    }
  }
</style>
