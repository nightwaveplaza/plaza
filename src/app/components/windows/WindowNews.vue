<template>
  <win-window v-slot="winProps" :width="350" name="news" :title="t('win.news.title')">
    <div class="p-2">
      <win-memo>
        <div v-if="article.text === ''" class="content-loading" />
        <div v-if="article.text !== ''" v-html="article.text" />
        <div v-if="article.text !== ''" class="row justify-content-between">
          <div class="col-auto">
            {{ article.author }}
          </div>
          <div class="col-auto">
            {{ sdy(article.created_at) }}
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
import helperComposable from '@app/composables/helperComposable'
import { useWindowsStore } from '@app/stores/windowsStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { sdy } = helperComposable()
const windowsStore = useWindowsStore()

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
    windowsStore.alert(t('errors.server', {error: (e as Error).message}), t('errors.error'))
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
