<template>
  <win-window ref="window" :width="350" name="news" title="News">
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
          <win-btn block @click="closeWindow">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { news } from '@common/js/api/api'
import settings from '@common/js/extras/settings'
import windowsComposable from '@common/js/composables/windowsComposable'
import helperComposable from '@common/js/composables/helperComposable'

// Composable
const { closeWindow } = windowsComposable('news')
const { sdy } = helperComposable()

// Reactive data
const article = ref({
  text: '',
  created_at: 0,
})
const page = ref(1)
const length = ref(1)
const pages = ref(1)

// Non-reactive
let latest = 0

// Methods
function getArticle () {
  news.get(page.value).then(res => {
    article.value = res.data.articles[0]
    pages.value = res.data.pages

    if (latest === 0) {
      latest = article.value.created_at
    }
  }).catch(() => {})
}

function changePage (newPage) {
  page.value = newPage
  getArticle()
}

onMounted(() => {
  getArticle()
})

onBeforeUnmount(() => {
  settings.save('latestNews', latest)
})
</script>
