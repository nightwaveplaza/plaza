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
          <div class="col-12 col-md-6 pr-0 pr-sm-2">
            <div class="text-field p-0 m-0 player-time-container">
              <win-player-visual ref="visual" link="audio"/>
              <win-player-time ref="time" />
            </div>
          </div>

          <div class="col col-md-6 d-none d-md-block">
            <win-player-volume @onchange="setVolume" @onload="updateVolume"/>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="col-5 col-md-6 col-sm-3 mb-1 mb-sm-0 pr-2">
            <win-btn class="player-play" block @click="play()">{{ playText }}</win-btn>
          </div>
          <div class="col-3 col-md-2 col-sm-3 pr-2">
            <win-player-reactions />
          </div>
          <div class="col-4 col-md-4 col-sm-3 mb-1 mb-sm-0">
            <win-btn block @click="openWindow('settings-background')">Settings</win-btn>
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
    ...mapGetters([
      'session'
    ]),
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
  },

  methods: {
    updateSong() {
      if (this.offline && this.state === STATE_PLAYING) {
        this.stopPlay();
        setTimeout(this.play, 2000);
      }

      if (this.state === STATE_PLAYING) {
        document.title = `${this.currentSong.artist} - ${this.currentSong.title}`;
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
      // Audio context
      if (!this.context && !this.source) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.context.createAnalyser();
        this.source = this.context.createMediaElementSource(this.$refs.audio);
      }

      this.$refs.audio.type = 'audio/mpeg';
      this.$refs.audio.src = 'https://radio.plaza.one/mp3';

      this.context.resume().then(() => {
        this.$refs.audio.type = 'audio/mpeg';
        this.$refs.audio.src = 'https://radio.plaza.one/mp3';

        // Can we play OGG Vorbis?
        const canPlayOGG = !!(this.$refs.audio.canPlayType &&
            this.$refs.audio.canPlayType('audio/ogg; codecs="vorbis"').
                replace(/no/, ''));
        if (canPlayOGG) {
          this.$refs.audio.type = 'audio/ogg; codecs="vorbis"';
          this.$refs.audio.src = 'https://radio.plaza.one/ogg';
        }

        this.$refs.audio.load();
        this.$refs.audio.volume = this.volume;

        document.title = `${this.currentSong.artist} - ${this.currentSong.title}`;
      });
    },

    audioCanPlay() {
      if (this.state === STATE_LOADING) {
        this.state = STATE_PLAYING;
        this.source.connect(this.context.destination);
        this.source.connect(this.analyser);
        this.$refs.audio.play();
        this.$refs.visual.startVisual();
      }
    },

    stopPlay() {
      this.$refs.visual.stopVisual();
      this.analyser.disconnect();
      this.source.disconnect();
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.src = '';

      this.state = STATE_IDLE;
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

    showDisplayMessage(text) {
      this.onDisplayTimeout = 2;
      this.onDisplayText = text;
    },

    showSongInfo() {
      if (this.currentSong.id) {
        this.songInfo(this.currentSong.id);
      }
    },
  },

};
</script>
