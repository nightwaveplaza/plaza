<template>
  <win-window ref="window" :width="360" :name="name" title="Song Info">
    <div class="p-2 song-info">
      <div v-if="song !== false">
        <div class="group-box p-2 m-0">
          <div class="row">
            <div class="col">
              <div class="mb-1">
                <div class="noselect"><strong>Artist:</strong><br/></div>
                {{ song.artist }}
              </div>
              <div class="mb-1">
                <div class="noselect"><strong>Album:</strong><br/></div>
                {{ song.album }}
              </div>
              <div class="mb-2">
                <div class="noselect"><strong>Title:</strong><br/></div>
                {{ song.title }}
              </div>
              <div>
                <i class="i icon-clock" /> {{ songLength }} &nbsp;
                <i class="i icon-like" style="color: #c12727" /> {{ song.likes }}
              </div>
            </div>
            <div class="col-5">
              <img :src="artwork" alt="artwork" class="artwork simple-border">
            </div>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-4 pr-1">
            <audio ref="audio" :src="song.preview_src" @pause="onPause" @play="onPlay" @timeupdate="timeUpdated"/>
            <win-btn block :disabled="song.preview_src === null" @click="play">{{ playText }}</win-btn>
          </div>
          <div class="col-2 pl-0">
            <win-btn block @click="favoriteSong"><i class="icon-favorite i" :style="{color: favoriteColor }" /></win-btn>
          </div>
          <div class="col-auto ml-auto">
            <win-btn class="px-4" @click="closeWindow()">Close</win-btn>
          </div>
        </div>
      </div>
      <div v-else class="text-center">Loading...</div>
    </div>

    <div v-if="song !== false" class="statusbar row no-gutters noselect">
      <div v-if="song.first_played_at" class="col cell">First played: {{ sdy(song.first_played_at) }}</div>
    </div>
  </win-window>
</template>

<script>
import {songs, user} from '@base/api/api';
import settings from '@base/extras/settings';

export default {
  data() {
    return {
      song: false,
      isPlaying: false,
      playTimeLeft: 0,
    };
  },

  props: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },

  computed: {
    songLength() {
      return this.dur(this.song.length);
    },
    playText() {
      return this.isPlaying ? 'Stop (' + this.dur(this.playTimeLeft) + ')' : 'Play preview';
    },
    artwork() {
      return this.song.artwork_sm_src ?? 'https://i.plaza.one/dead.jpg';
    },
    favoriteColor() {
      return this.song.favorite_id ? '#FFD300' : '';
    },
  },

  mounted() {
    this.sending = false;
    this.fetchSongInfo(this.id);
  },

  methods: {
    fetchSongInfo(songId) {
      songs.get(songId).then(result => {
        this.song = result.data;
      }).catch(error => {
        this.alert(error.response.data.error, 'Error');
        this.closeWindow();
      });
    },

    async favoriteSong() {
      if (this.sending) return;

      this.sending = true;

      try {
        if (this.song.favorite_id) {
          await user.deleteFavorite(this.song.favorite_id);
          this.song.favorite_id = null;
        } else {
          const res = await user.addFavorite(this.song.id);
          this.song.favorite_id = res.data.favorite_id;
        }
      } catch(error) {
        if (error.response.status === 401) {
          this.alert('Please sign in to your Nightwave Plaza account to use the like button.', 'Error');
        }
        console.log("Error sending favorite");
      } finally {
        this.sending = false;
      }
    },

    getVolume() {
      const volume = settings.load('volume');

      if (volume === null) {
        return 1;
      }

      return volume / 100;
    },

    play() {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.$refs.audio.volume = this.getVolume();
        this.$refs.audio.play();
      }
    },

    stop() {
      this.isPlaying = false;
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
    },

    onPlay() {
      this.isPlaying = true;
    },

    onPause() {
      this.isPlaying = false;
    },

    timeUpdated() {
      if (this.isPlaying) {
        this.playTimeLeft = 30 - this.$refs.audio.currentTime;
      }
    },
  },

  beforeDestroy() {
    if (this.isPlaying) {
      this.stop();
      this.$refs.audio = null;
    }
  },
};
</script>
