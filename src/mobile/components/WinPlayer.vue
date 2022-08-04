<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-auto align-self-center mb-2 mb-sm-0">
      <div class="cover simple-border noselect">
        <img :src="artwork" alt="artwork"/>
      </div>
    </div>

    <div class="col-12 col-sm">
      <div class="player-meta pl-sm-2">
        <div class="player-artist track-artist mb-2">{{ currentSong.artist }}</div>
        <div class="player-title track-title">{{ currentSong.title }}</div>

        <div class="row my-1 my-sm-2 py-1 no-gutters noselect">
          <div class="col-12 col-md-6 pr-0">
            <div class="text-field p-0 m-0 player-time-container">
              <win-player-time ref="time"/>
            </div>
          </div>
        </div>

        <div class="row no-gutters">
          <div :class="{'col-6': !isPlaying, 'col-4': isPlaying}" class="mb-1 mb-sm-0 pr-2">
            <win-btn class="player-play" block @click="play()">{{ playText }}</win-btn>
          </div>

          <div v-if="isPlaying" class="col-2 mb-1 mb-sm-0 pr-2">
            <win-btn block @click="openWindow('player-timer')">
              <i :style="{ color: timerColor }" class="i icon-clock"/>
            </win-btn>
          </div>

          <div class="col-3 pr-2">
            <win-player-reactions/>
          </div>

          <div class="col-3 mb-1 mb-sm-0">
            <win-btn block class="btn-start" @click="openDrawer">&nbsp;</win-btn>
          </div>
        </div>
      </div>
    </div>

    <win-player-status ref="status"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {Native} from '@mobile/bridge/native';

export default {
  computed: {
    ...mapGetters(['sleepTime', 'isPlaying']),
    ...mapGetters('player', ['currentSong']),

    artwork() {
      return this.currentSong.id && this.currentSong.artwork_src ? this.currentSong.artwork_src : 'https://i.plaza.one/dead.jpg';
    },

    playText() {
      return this.isPlaying ? 'Stop' : 'Play';
    },

    timerColor() {
      return this.sleepTime !== 0 ? '#3455DB' : '';
    },
  },

  methods: {
    play() {
      if (!this.isPlaying) {
        Native.audioPlay();
      } else {
        Native.audioStop();
        this.closeWindow('player-timer');
      }
    },
    openDrawer() {
      Native.openDrawer();
    }
  },

};
</script>
