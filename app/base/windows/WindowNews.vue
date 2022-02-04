<template>
  <win-window ref="window" :width="350" name="news" title="News">
    <div class="p-2">
      <win-memo>
        <div v-if="article.text === ''" class="content-loading"></div>
        <div v-if="article.text !== ''" v-html="article.text"/>
        <div v-if="article.text !== ''" class="row justify-content-between">
          <div class="col-auto" v-html="article.author"></div>
          <div class="col-auto" v-html="shortDateYear(article.created_at)"></div>
        </div>
      </win-memo>

      <!-- Buttons -->
      <div class="row mt-2 no-gutters noselect">
        <div class="col">
          <win-pagination v-if="length > 0" :pages="pages" @change="changePage"/>
        </div>
        <div class="col-4 ml-auto">
          <win-btn block @click="closeWindow()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {news} from '@base/api/api';
import settings from '@base/extras/settings';

export default {
  data() {
    return {
      article: {
        text: '',
        created_at: 0,
      },
      page: 1,
      length: 1,
      pages: 1,
      latest: 0,
    };
  },

  mounted() {
    this.getArticle();
  },

  methods: {
    getArticle() {
      news.get(this.page).then(result => {
        this.article = result.data.articles[0];

        if (this.latest === 0) {
          this.latest = this.article.created_at;
        }
      }).catch();
    },

    changePage(page) {
      this.page = page;
      this.getArticle();
    },
  },

  beforeCreate() {
    console.log('wwww');
  },

  beforeDestroy() {
    settings.save('latestNews', this.latest);
  },
};
</script>
