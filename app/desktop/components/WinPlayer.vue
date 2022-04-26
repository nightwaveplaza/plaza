<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0 px-4 px-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork" @click="showSongInfo"/>
      </div>
      <audio ref="audio" crossorigin="anonymous" preload="auto" @canplay="audioCanPlay"/>
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">{{ currentSong.artist }}</div>
        <div class="player-title track-title">{{ currentSong.title }}</div>

        <div class="row my-1 my-sm-2 py-1 no-gutters noselect">
          <div class="col-12 col-md-7 pr-0 pr-md-2">
            <div class="text-field p-0 m-0 player-time-container">
              <win-player-visual ref="visual" link="audio"/>
              <win-player-time ref="time" />
            </div>
          </div>

          <div class="col col-md-5 d-none d-md-block">
            <win-player-volume @onchange="setVolume" @onload="updateVolume"/>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="col-6 col-md-7 pr-md-2">
            <div class="row no-gutters">
              <div class="col-6 col-md-8">
                <win-btn class="player-play" block @click="play()" v-html="playText"/>
              </div>
              <div class="col-6 col-md-4">
                <win-player-reactions />
              </div>
            </div>
          </div>
          <div class="col-6 col-md-5">
            <div class="row no-gutters">
              <div class="col-6">
                <win-btn block @click="auth ? openWindow('user') : openWindow('user-login')">
                  <i class="i icon-user mr-0" />
                </win-btn>
              </div>
              <div class="col-6">
                <win-btn block @click="openWindow('settings-background')">
                  <i class="i icon-cog mr-0" />
                </win-btn>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <win-player-status ref="status" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

const STATE_IDLE = 0;
const STATE_LOADING = 1;
const STATE_PLAYING = 2;

export default {
  data() {
    return {
      offline: false,

      analyser: false,
      context: false,
      source: false,
      volume: 100,
      state: 0
    };
  },

  computed: {
    ...mapGetters('user', ['auth']),
    ...mapGetters('player', ['currentSong']),

    artwork() {
      return this.currentSong.id && this.currentSong.artwork_src ? this.currentSong.artwork_src : 'img/dead.jpg';
    },

    playText() {
      switch (this.state) {
        case STATE_IDLE:
          return 'Play';
        case STATE_LOADING:
          return 'Loading...';
        case STATE_PLAYING:
          return 'Stop';
      }
    },
  },

  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'player/currentSong') {
        this.updateSong();
      }
    });

    this.setMediaSessionActions();
  },

  methods: {
    updateSong() {
      if (this.offline && this.state === STATE_PLAYING) {
        this.stopPlay();
        setTimeout(this.play, 2000);
      }

      if (this.state === STATE_PLAYING) {
        document.title = `${this.currentSong.artist} - ${this.currentSong.title}`;
        this.updateMediaSession();
      }

      this.offline = false;
    },

    play() {
      if (this.state === STATE_IDLE) {
        this.state = STATE_LOADING;
        this.startPlay();
      } else {
        this.stopPlay();
      }
    },

    startPlay() {
      const noCacheStr = 'nocache=' + Date.now();

      // Can we play OGG Vorbis?
      const canPlayOGG = !!(this.$refs.audio.canPlayType &&
          this.$refs.audio.canPlayType('audio/ogg; codecs=opus').
              replace(/no/, ''));
      if (canPlayOGG) {
        this.$refs.audio.type = 'audio/ogg; codecs=opus';
        this.$refs.audio.src = 'https://radio.plaza.one/ogg?' + noCacheStr;
      } else {
        this.$refs.audio.type = 'audio/mpeg';
        this.$refs.audio.src = 'https://radio.plaza.one/mp3?' + noCacheStr;
      }

      this.$refs.audio.load();
      this.$refs.audio.volume = this.volume;

      document.title = `${this.currentSong.artist} - ${this.currentSong.title}`;
    },

    async audioCanPlay() {
      if (this.state === STATE_LOADING) {
        this.state = STATE_PLAYING;

        // Audio context
        if (!this.context && !this.source) {
          this.context = new (window.AudioContext || window.webkitAudioContext)();
          this.analyser = this.context.createAnalyser();
          this.source = this.context.createMediaElementSource(this.$refs.audio);
        }

        this.source.connect(this.context.destination);
        this.source.connect(this.analyser);

        try {
          await this.$refs.audio.play();
        } catch(e) {
          console.log(e);
        }
        this.$refs.visual.startVisual();
        this.updateMediaSession();
        this.setMediaSessionState('playing');
      }
    },

    stopPlay() {
      this.$refs.visual.stopVisual();
      this.analyser.disconnect();
      this.source.disconnect();
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
      // disabled for ios safari
      // this.$refs.audio.src = '';

      this.state = STATE_IDLE;
      this.setMediaSessionState('paused') ;
      document.title = 'Nightwave Plaza - Online Vaporwave Radio';
    },

    setVolume(volume) {
      this.updateVolume(volume);
      this.$refs.time.showText('Volume: ' + volume + '%');
    },

    updateVolume(volume) {
      this.volume = volume / 100;
      if (this.state === STATE_PLAYING) {
        this.$refs.audio.volume = this.volume;
      }
    },

    showSongInfo() {
      if (this.currentSong.id) {
        this.songInfo(this.currentSong.id);
      }
    },

    updateMediaSession() {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentSong.title,
          artist: this.currentSong.artist,
          album: this.currentSong.album,
          artwork: [
            { src: this.currentSong.artwork_sm_src,   sizes: '300x300',   type: 'image/jpg' },
            { src: this.currentSong.artwork_src, sizes: '500x500', type: 'image/jpg' }
          ]
        });
      } else {
        console.log('No media session')
      }
    },

    setMediaSessionActions() {
      if ('mediaSession' in navigator) {
        const actionHandlers = [
          ['play', this.play],
          ['pause', this.play ],
          ['stop', this.play]
        ];

        for (const [action, handler] of actionHandlers) {
          try {
            navigator.mediaSession.setActionHandler(action, handler);
          } catch (error) {
            console.log(`The media session action "${action}" is not supported yet.`);
          }
        }
      }
    },

    setMediaSessionState(state) {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = state;
      }
    }
  },

};
</script>
