<template>
  <win-window v-slot="winProps" :width="350" :name="name" :title="t('win.news.title')">
    <div class="p-2">
      <div v-if="isLoading" class="content-loading" style="min-height:200px" />
      <win-memo v-if="!isLoading">
        <template v-for="article in news?.data">
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
      <div class="row mt-2 no-gutters noselect">
        <div class="col">
          <win-pagination v-if="news && news.meta.total > 0" :pages="news.meta.last_page" :disabled="isLoading" @change="changePage" />
        </div>
        <div class="col-4 ml-auto">
          <win-button block @click="winProps.close()">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows, WinType } from '@app/composables/useWindows'
import { useNewsApi } from '@app/composables/api'
import { fmtDate } from '@app/utils/timeFormats.ts'

const { t } = useI18n()
const { winAlert } = useWindows()
const { getNews } = useNewsApi()
const { closeWindow } = useWindows()

defineProps<{
  name: string
}>()

const page = ref(1)
const { isLoading, data: news, fetch, error } = getNews()

function changePage (newPage: number): void {
  page.value = newPage
  fetchNews()
}

function fetchNews () {
  fetch(page.value)
}

watch(() => error.value, (error) => {
  if (error) winAlert(error.message, t('errors.error'))
  if (!news.value) closeWindow(WinType.NEWS)
})

onMounted(() => {
  fetchNews()
})
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
