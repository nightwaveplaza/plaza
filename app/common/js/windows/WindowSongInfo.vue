<template>
  <win-window ref="window" :width="342" :name="name" title="Song Info">
    <div class="p-2 song-info">
      <div v-if="song !== false">
        <div class="row no-gutters mb-2">
          <div class="col-4 col-sm-auto align-self-center pr-2">
            <img :src="artwork" alt="artwork" class="artwork simple-border">
          </div>
          <div class="col">
            <div class="group-box p-2 m-0">
              <div class="mb-1">
                <div class="noselect"><strong>Artist:</strong><br/></div>
                {{ song.artist }}
              </div>
              <div class="mb-1">
                <div class="noselect"><strong>Album:</strong><br/></div>
                {{ song.album }}
              </div>
              <div class="mb-1">
                <div class="noselect"><strong>Title:</strong><br/></div>
                {{ song.title }}
              </div>
              <div class="row no-gutters">
                <div class="col">
                  <div class="noselect"><strong>Length:</strong><br/></div>
                  {{ songLength }}
                </div>
                <div class="col">
                  <div class="noselect"><strong>Likes:</strong><br/></div>
                  {{ song.likes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-between">
          <div class="col-5">
            <audio ref="audio" :src="song.preview_src" @pause="onPause" @play="onPlay" @timeupdate="timeUpdated"/>
            <win-btn block :disabled="song.preview_src === null" @click="play">{{ playText }}</win-btn>
          </div>
          <div class="col-auto">
            <win-btn class="px-4" @click="closeWindow()">Close</win-btn>
          </div>
        </div>
      </div>
      <div v-else class="text-center">Loading...</div>
    </div>

    <div v-if="song !== false" class="statusbar row no-gutters noselect">
      <div v-if="song.first_played_at" class="col cell">First played: {{ shortDateYear(song.first_played_at) }}</div>
    </div>
  </win-window>
</template>

<script>
import {songs} from '@common/js/api/api';
import settings from '@common/js/extras/settings';

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
      return this.playTime(this.song.length);
    },
    playText() {
      return this.isPlaying ? 'Stop (' + this.playTime(this.playTimeLeft) + ')' : 'Play preview';
    },
    artwork() {
      return this.song.artwork_sm_src ?? 'img/dead.jpg';
    },
  },

  mounted() {
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
