export const playerStore = {
  namespaced: true,

  state: {
    song: {
      id: '',
      artist: '...',
      title: '...',
      position: 0,
      length: 0,
      reactions: 0,
      // etc
    },
    listeners: 0,
    reaction: {
      score: 0,
      songId: ''
    }
  },

  mutations: {
    listeners(state, listeners) {
      state.listeners = listeners;
    },

    reactions(state, r) {
      state.song.reactions = r;
    },

    reaction(state, score) {
      state.reaction.songId = state.song.id;
      state.reaction.score = score;
    },

    clearReaction(state) {
      state.reaction.songId = '';
      state.reaction.score = 0;
    },

    currentSong(state, song) {
      state.song = song;
    },

    artwork(state, artwork) {
      state.song.artwork_src = artwork;
    }
  },

  getters: {
    listeners: state => state.listeners,
    currentSong: state => state.song,
    reaction: state => state.reaction,
  }
};
