<template>
  <win-btn block @click="like"><i :class="likeIcon" class="i mr-1" :style="{color: likeColor}"/>{{ playerPlaybackStore.reactions }}</win-btn>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { reactions } from '@common/js/api/api'
import settings from '@common/js/extras/settings'
import windowsComposable from '@common/js/composables/windowsComposable'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const playerPlaybackStore = usePlayerPlaybackStore()
const userReactionStore = useUserReactionStore()

// Composable
const { alert } = windowsComposable()

// Props
const props = defineProps({
  name: String,
})

// Non-reactive
let sending = false

// Computed
const likeIcon = computed(() => userReactionStore.score > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => {
  if (playerPlaybackStore.songId === userReactionStore.songId) {
    return userReactionStore.score === 2 ? CL_FAV : userReactionStore.score === 1 ? CL_LIKE : ''
  }
})

// Methods
function like () {
  if (userReactionStore.score === 1) {
    send(2)
  } else if (userReactionStore.score === 2) {
    send(0)
  } else {
    send(1)
  }
}

function send (score) {
  if (sending) {
    return
  }

  sending = true

  reactions.react(score).then(res => {
    playerPlaybackStore.reactions = res.data.reactions
    userReactionStore.score = score
    userReactionStore.songId = playerPlaybackStore.songId
    userReactionStore.save()
    // store.dispatch('player/setReaction', score).then() // TODO
    showTip()
  }).catch(err => {
    if (err.response.status === 401) {
      alert('Please sign in to your Nightwave Plaza account to use the like button.', 'Error')
    }
  }).finally(() => {
    sending = false
  })
}

function showTip () {
  const saved = settings.load('reactionTip')
  if (saved) return

  alert(`You have liked the song. Nice!<br />
                        Clicking the <i class="i icon-like"></i> button twice will add song to your favorites list. Give it a try!`,
    'N I C E', 'info')

  settings.save('reactionTip', true)
}

onMounted(() => {
  playerPlaybackStore.$subscribe((mutation, state) => {
    userReactionStore.load()
  })
})
</script>
