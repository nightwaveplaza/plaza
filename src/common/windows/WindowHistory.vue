<template>
  <win-window ref="window" :width="400" fluidHeight name="history" title="Play History">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex mb-1">
          <div class="row no-gutters w-100">
            <div v-if="history.length > 0" class="col">Showing history: {{ sd(dateFrom) }} &mdash;
              {{ sd(this.dateTo) }}.
            </div>
            <div class="col-auto"><a href="https://plaza.one/lastfm" target="_blank">Last.fm history</a></div>
          </div>
        </div>

        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading"></div>
            <win-list ref="list" scroll>
              <tr v-for="song in history">
                <td class="pl-2 pr-1 py-1 show-info" @click="songInfo(song.id)">
                  <div class="artist">{{ song.artist }}</div>
                  <div class="title">{{ song.title }}</div>
                </td>
                <td class="pr-2 text-right noselect" style="width: 48px">
                  {{ sd(song.played_at) }}<br/>
                  {{ gt(song.played_at) }}
                </td>
              </tr>
            </win-list>
          </div>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination v-if="history.length > 0" :pages="pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="closeWindow()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters noselect">
      <div class="col-3 cell d">Pages: {{ pages }}</div>
      <div class="col cell">Songs: {{ total }}</div>
    </div>
  </win-window>
</template>


<script>
import {history} from '@common/api/api';
import * as dayjs from 'dayjs'

export default {
  data() {
    return {
      loading: true,
      history: [],
      total: 0,
      perPage: 25,
      pages: 0,
      page: 1,
      dateFrom: 0,
      dateTo: 0,
    };
  },

  mounted() {
    this.fetchHistory(this.page);
  },

  watch: {
    page() {
      this.fetchHistory(this.page);
    },
  },

  methods: {
    changePage(page) {
      this.page = page;
    },

    fetchHistory(page) {
      this.$refs.list.scrollTop();
      this.loading = true;

      history.get(page).then(result => {
        this.perPage = result.data.per_page;
        this.pages = result.data.pages;
        this.history = result.data.songs;
        this.total = result.data.count;
        this.loading = false;
        this.dateFrom = result.data.from_date;
        this.dateTo = result.data.to_date;
        this.$refs.list.refreshScrollbar();
      }).catch(error => this.alert(error.response.data.error, 'Error'));
    },

    refreshScrollbar() {
      this.$nextTick(() => {
        this.scrollbar.update();
      });
    },

    gt(date) {
      return dayjs.unix(date).format('HH:mm')
    },
  },

  beforeDestroy() {
    this.history = null;
  },
};
</script>
