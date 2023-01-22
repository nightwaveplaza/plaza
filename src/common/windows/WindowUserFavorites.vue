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
                      <img :src="currentSong.artwork_src ? currentSong.artwork_src : 'https://i.plaza.one/dead.jpg'"
                           alt="artwork"/>
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
                      <img :src="like.song.artwork_src ? like.song.artwork_src : 'https://i.plaza.one/dead.jpg'"
                           alt="artwork"/>
                    </td>
                    <td class="pl-1 show-info" @click="songInfo2(like.song.id)">
                      <div class="artist">{{ like.song.artist }}</div>
                      <div class="title">{{ like.song.title }}</div>
                      <div class="date">
                        <i>{{ sdy(like.created_at) }}</i>
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
                <i>Your list is empty. Click the <i class="i icon-like"></i> buton to add songs to this list.</i>
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
              <win-btn class="px-4" @click="closeWindow2">Close</win-btn>
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

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { user } from '@common/api/api'
import windowsComposable from '@common/composables/windowsComposable'
import helperComposable from '@common/composables/helperComposable'

// Composable
const { alert2, closeWindow2, openWindow2, songInfo2 } = windowsComposable('user-favorites')
const { sdy } = helperComposable()

const store = useStore()

// Reactive data
const loading = ref(true)
const likes = ref([])
const deleted = ref([])
const total = ref(0)
const perPage = ref(25)
const pages = ref(4)
const page = ref(1)

// Refs
const list = ref(null)

//Computed
const currentSong = computed(() => store.getters['player/currentSong'])
const reaction = computed(() => store.getters['player/reaction'])
// return this.currentSong.id === this.reaction.songId && this.page === 1 && this.reaction.score === 2
const showCurrentLike = computed(() => false)

// Methods
function fetchLikes (page) {
  list.value.scrollTop()
  loading.value = true

  user.favorites(page).then(res => {
    perPage.value = res.data.per_page
    pages.value = res.data.pages
    likes.value = res.data.favorites
    total.value = res.data.count
    loading.value = false
    list.value.refreshScrollbar()
  }).catch(error => alert2(error.response.data.error, 'Error')).finally(() => {
    loading.value = false
  })
}

function changePage (newPage) {
  if (loading.value) {
    return;
  }

  page.value = newPage
  fetchLikes(newPage)
}

function deleteLike (favoriteId) {
  user.deleteFavorite(favoriteId).then(() => {
    deleted.value.push(favoriteId)
  }).catch(error => alert2(error.response.data.error, 'Error'))
}

onMounted(() => {
  fetchLikes(page.value)
})

</script>
