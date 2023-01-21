<template>
  <win-btn block @click="like"><i :class="likeIcon" class="i mr-1" :style="{color: likeColor}"/>{{ likes }}</win-btn>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { reactions } from '@common/api/api'
import settings from '@common/extras/settings'
import windowsComposable from '@common/composables/windowsComposable'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const store = useStore()

// Composable
const { alert2 } = windowsComposable('user-favorites')

// Props
const props = defineProps({
  name: String,
})

// Reactive data
const likes = ref(0)
const sending = ref(false)

// Computed
const reaction = computed(() => store.getters['player/reaction'])
const currentSong = computed(() => store.getters['player/currentSong'])
const likeIcon = computed(() => reaction.value.score > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => {
  if (currentSong.value.id === reaction.value.songId) {
    return reaction.value.score === 2 ? CL_FAV : reaction.value.score === 1 ? CL_LIKE : ''
  }
})

// Methods
function like () {
  if (reaction.value.score === 1) {
    send(2)
  } else if (reaction.value.score === 2) {
    send(0)
  } else {
    send(1)
  }
}

function send (score) {
  if (sending.value) {
    return
  }

  sending.value = true

  reactions.react(score).then(res => {
    store.commit('player/reactions', res.data.reactions)
    store.dispatch('player/setReaction', score).then()
    sendTip()
  }).catch(err => {
    if (err.response.status === 401) {
      alert2('Please sign in to your Nightwave Plaza account to use the like button.', 'Error')
    }
  }).finally(() => {
    sending.value = false
  })
}

function loadState () {
  const saved = settings.load('reaction')
  if (saved && saved.songId === currentSong.value.id) {
    store.commit('player/reaction', saved.score)
  } else {
    store.commit('player/clearReaction')
  }
}

function saveState () {
  settings.save('reaction', reaction.value)
}

function sendTip () {
  const saved = settings.load('reactionTip')
  if (saved) return

  alert2(`You have liked the song. Nice!<br />
                        Clicking the <i class="i icon-like"></i> button twice will add song to your favorites list. Give it a try!`,
      'N I C E', 'info')

  settings.save('reactionTip', true)
}

onMounted(() => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'player/reactions' || mutation.type === 'player/currentSong') {
      likes.value = state.player.song.reactions
    }

    if (mutation.type === 'player/currentSong') {
      loadState()
    }

    if (mutation.type === 'player/reaction') {
      saveState()
    }
  })
})
</script>
