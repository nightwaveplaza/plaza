<template>
  <win-window v-slot="winProps" :width="350" :name="name" :title="t('win.news.title')">
    <div class="p-2">
      <win-memo>
        <div v-if="article.text === ''" class="content-loading" />
        <div v-if="article.text !== ''" v-html="article.text" />
        <div v-if="article.text !== ''" class="row justify-content-between">
          <div class="col-auto">
            {{ article.author }}
          </div>
          <div class="col-auto">
            {{ fmtDate(article.created_at) }}
          </div>
        </div>
      </win-memo>

      <!-- Buttons -->
      <div class="row mt-2 no-gutters noselect">
        <div class="col">
          <win-pagination v-if="length > 0" :pages="pages" @change="changePage" />
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
import { onMounted, ref } from 'vue'
import { api } from '@app/api/api'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@app/composables/useApiError.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useTimeFormats } from '@app/composables/useTimeFormats.ts'

const { t } = useI18n()
const { fmtDate } = useTimeFormats()
const { winAlert } = useWindows()

defineProps<{
  name: string
}>()

const article = ref({
  text: '',
  author: '',
  created_at: 0,
})
const page = ref(1)
const length = ref(1)
const pages = ref(1)

function getArticle (): void {
  api.news.get(page.value).then(res => {
    article.value = res.data.articles[0]!
    pages.value = res.data.pages
  }).catch(e => {
    winAlert(useApiError(e), t('errors.error'))
  })
}

function changePage (newPage: number): void {
  page.value = newPage
  getArticle()
}

onMounted(() => {
  getArticle()
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
