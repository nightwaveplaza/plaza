<template>
  <win-window :width="350" name="news" title="News" v-slot="winProps">
    <div class="p-2">
      <win-memo>
        <div v-if="article.text === ''" class="content-loading"></div>
        <div v-if="article.text !== ''" v-html="article.text"/>
        <div v-if="article.text !== ''" class="row justify-content-between">
          <div class="col-auto" v-html="article.author"></div>
          <div class="col-auto" v-html="sdy(article.created_at)"></div>
        </div>
      </win-memo>

      <!-- Buttons -->
      <div class="row mt-2 no-gutters noselect">
        <div class="col">
          <win-pagination v-if="length > 0" :pages="pages" @change="changePage"/>
        </div>
        <div class="col-4 ml-auto">
          <win-btn block @click="winProps.close()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@common/js/api/api'
import helperComposable from '@common/js/composables/helperComposable'
import { useWindowsStore } from '@common/js/stores/windowsStore'

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

function getArticle () {
  api.news.get(page.value).then(res => {
    article.value = res.data.articles[0]
    pages.value = res.data.pages
  }).catch(e => {
    windowsStore.alert((e as Error).message, 'Error')
  })
}

function changePage (newPage: number) {
  page.value = newPage
  getArticle()
}

onMounted(() => {
  getArticle()
})
</script>
