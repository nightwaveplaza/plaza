<template>
  <win-window ref="window" :width="440" fluidHeight name="ratings" title="Ratings">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <!-- Range buttons -->
        <div class="d-flex mb-1">
          <win-btn :class="{ active: range === 'overtime' }" class="songs-range mr-1" @click="range = 'overtime'">
            Overtime
          </win-btn>
          <win-btn :class="{ active: range === 'monthly' }" class="songs-range mr-1" @click="range = 'monthly'">
            Monthly
          </win-btn>
          <win-btn :class="{ active: range === 'weekly' }" class="songs-range mr-0" @click="range = 'weekly'">
            Weekly
          </win-btn>
        </div>

        <!-- Song list -->
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading"></div>
            <win-list scroll ref="list">
              <tr v-for="(chart, i) in charts" class="hover">
                <td class="text-center noselect" style="width: 37px">{{
                    addZeros((page - 1) * perPage + i + 1, 3)
                  }}
                </td>
                <td class="py-1 show-info" @click="songInfo(chart.id)">
                  <div class="artist">{{ chart.artist }}</div>
                  <div class="title">{{ chart.title }}</div>
                </td>
                <td v-if="range !== 'overtime'" class="text-right noselect pr-2 nowrap" style="width: 57px">
                  {{ chart.likes }}<i class="icon-like ml-1" style="color: #c12727"/></td>
              </tr>
            </win-list>
          </div>
        </div>

        <!-- List footer buttons -->
        <div class="d-flex">
          <div class="row no-gutters mt-2 w-100">
            <div class="col">
              <win-pagination ref="pagination" :pages="pages" @change="changePage"/>
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
import {ratings} from '@common/js/api/api';

export default {
  data() {
    return {
      loading: true,
      charts: [],
      total: 0,
      perPage: 25,
      pages: 4,
      page: 1,
      range: 'overtime',
    };
  },

  mounted() {
    this.fetchRatings(this.range, this.page);
  },

  watch: {
    range() {
      this.page = 1;
      this.$refs.pagination.reset();
      this.fetchRatings(this.range, this.page);
    },
    page() {
      this.fetchRatings(this.range, this.page);
    },
  },

  methods: {
    changePage(page) {
      this.page = page;
    },

    fetchRatings(range, page) {
      this.$refs.list.scrollTop();
      this.loading = true;

      ratings.get(range, page).then(result => {
        this.perPage = result.data.per_page;
        this.pages = result.data.pages;
        this.charts = result.data.songs;
        this.total = result.data.count;
        this.loading = false;
        this.$refs.list.refreshScrollbar();
      }).catch(error => this.alert(error.response.data.error, 'Error'));
    },
  },

  beforeDestroy() {
    this.charts = null;
  },
};
</script>
