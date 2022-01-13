<template>
  <win-window ref="window" :width="450" fluidHeight name="user-favorites" title="My Favorites">
    <div class="content-fluid p-2">
      <div class="d-flex flex-column h-100">
        <div class="d-flex flex-grow-1 align-items-stretch">
          <div style="position: relative" class="w-100">
            <div v-if="loading" class="content-loading noselect"></div>

            <win-list scroll ref="list">
              <template v-if="likes.length > 0 && !loading">
                <table>
                  <tr v-if="showCurrentLike">
                    <td class="p-1 noselect" style="width: 62px">
                      <img :src="currentSong.artwork_src ? currentSong.artwork_src : 'img/dead.jpg'" alt="artwork"/>
                    </td>
                    <td class="pl-1">
                      <div class="artist">{{ currentSong.artist }}</div>
                      <div class="title">{{ currentSong.title }}</div>
                      <div class="date"><i>Now</i></div>
                    </td>
                    <td class="noselect" style="width: 70px"/>
                  </tr>

                  <tr v-for="(like, i) in likes" :class="{ strike: deleted.includes(like.id) }"
                      class="hover">
                    <td class="p-1 noselect" style="width: 62px">
                      <img :src="like.song.artwork_src ? like.song.artwork_src : 'img/dead.jpg'"
                           alt="artwork"/>
                    </td>
                    <td class="pl-1 show-info" @click="songInfo(like.song.id)">
                      <div class="artist">{{ like.song.artist }}</div>
                      <div class="title">{{ like.song.title }}</div>
                      <div class="date">
                        <i>{{ shortDateYear(like.created_at) }}</i>
                      </div>
                    </td>
                    <td class="text-center noselect" style="width: 70px">
                      <a v-if="!deleted.includes(like.song.id)" class="link favorites-remove"
                         role="button"
                         @click="deleteLike(like.id)">Remove</a>
                    </td>
                  </tr>
                </table>
                <div class="ps__rail-y noselect" style="display: block;top: 0;right: 0;height: 100%;"></div>
              </template>

              <div v-else-if="!loading" class="favorites-empty noselect">
                <i>Your list is empty. Click the <i class="icon-like"></i> buton to add songs to this list.</i>
              </div>
            </win-list>

          </div>
        </div>

        <div class="d-flex">
          <div class="row no-gutters pt-2 w-100">
            <div class="col">
              <win-pagination :pages="pages" @change="changePage"/>
            </div>
            <div class="col-auto">
              <win-btn class="px-4" @click="closeWindow()">Close</win-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="statusbar row no-gutters song-list-statusbar noselect">
      <div class="col-3 cell d">Pages: {{ pages }}</div>
      <div class="col cell">Songs: {{ total }}</div>
    </div>
  </win-window>
</template>

<script>
import {mapGetters} from 'vuex';
import {user} from '@common/js/api/api';

export default {
  data() {
    return {
      loading: true,
      likes: [],
      deleted: [],
      total: 0,
      perPage: 25,
      pages: 4,
      page: 1,
    };
  },

  computed: {
    ...mapGetters('player', ['currentSong', 'reaction']),

    showCurrentLike() {
      return false;
      // return this.currentSong.id === this.reaction.songId && this.page === 1 && this.reaction.score === 2
    }
  },

  mounted() {
    this.fetchLikes(this.page);
  },

  methods: {
    fetchLikes(page) {
      this.$refs.list.scrollTop();
      this.loading = true;

      user.favorites(page).then(result => {
        this.perPage = result.data.per_page;
        this.pages = result.data.pages;
        this.likes = result.data.favorites;
        this.total = result.data.count;
        this.loading = false;
        this.$refs.list.refreshScrollbar();
      }).catch(error => this.alert(error.response.data.error, 'Error'));
    },

    changePage(page) {
      this.page = page;
      this.fetchLikes(page);
    },

    deleteLike(favoriteId) {
      user.deleteFavorite(favoriteId).then(result => {
        this.deleted.push(favoriteId);
      }).catch(error => this.alert(error.response.data.error, 'Error'));
    },
  },

  beforeDestroy() {
    this.likes = null;
  },
};
</script>
