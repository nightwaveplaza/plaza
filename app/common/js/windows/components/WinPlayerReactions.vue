<template>
  <win-btn block @click="like"><i :class="likeIcon" :style="{color: likeColor}"/>{{ likes }}</win-btn>
</template>

<script>
import {mapGetters} from 'vuex';
import {reactions} from '@common/js/api/api';
import settings from '@common/js/extras/settings';

const CL_FAV = '#FFD300';
const CL_LIKE = '#c12727';

export default {
  props: {
    name: {
      type: String,
    },
  },

  data() {
    return {
      likes: 0,
    };
  },

  computed: {
    ...mapGetters('player', ['reaction', 'currentSong']),

    likeIcon() {
      return this.reaction.score > 1 ? 'icon-favorite' : 'icon-like';
    },
    likeColor() {
      if (this.currentSong.id === this.reaction.songId) {
        return this.reaction.score === 2 ? CL_FAV : this.reaction.score === 1 ? CL_LIKE : '';
      }
    },
  },

  created() {
    this.sending = false;
  },

  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'player/reactions' || mutation.type === 'player/currentSong') {
        this.likes = state.player.song.reactions;
      }

      if (mutation.type === 'player/currentSong') {
        this.loadState();
      }

      if (mutation.type === 'player/reaction') {
        this.saveState();
      }
    });
  },

  methods: {
    like() {
      if (this.reaction.score === 1) {
        this.send(2);
      } else if (this.reaction.score === 2) {
        this.send(0);
      } else {
        this.send(1);
      }
    },

    async send(score) {
      // Чтоб не кликали 100 раз подряд
      if (this.sending) {
        return;
      }

      this.sending = true;

      try {
        const res = await reactions.react(score);
        this.$store.commit('player/reactions', res.data.reactions);
        this.$store.commit('player/reaction', score);
        this.sendTip();
      } catch (error) {
        if (error.response.status === 401) {
          this.alert('Please sign in to your Nightwave Plaza account to use the like button.', 'Error');
        }
      } finally {
        this.sending = false;
      }
    },

    loadState() {
      const saved = settings.load('reaction');
      if (saved && saved.songId === this.currentSong.id) {
        this.$store.commit('player/reaction', saved.score);
      } else {
        this.$store.commit('player/clearReaction');
      }
    },

    saveState() {
      settings.save('reaction', this.reaction);
    },

    sendTip() {
      const saved = settings.load('reactionTip');
      if (saved) return;

      this.alert(`You have liked the song. Nice!<br />
                        Clicking the <i class="icon-like"></i>button twice will add song to your favorites list. Give it a try!`,
          'N I C E', 'info');

      settings.save('reactionTip', true);
    },
  },

};
</script>
