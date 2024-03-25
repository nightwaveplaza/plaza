<template>
  <win-btn block @click="like"><i :class="likeIcon" class="i mr-1" :style="{color: likeColor}"/>
    {{ playerPlaybackStore.reactions }}
  </win-btn>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { reactions } from '@common/js/api/api'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import { prefs } from '@common/js/extras/prefs'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const playerPlaybackStore = usePlayerPlaybackStore()
const userReactionStore = useUserReactionStore()
const windowsStore = useWindowsStore()

const likeIcon = computed(() => userReactionStore.score > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => {
  if (playerPlaybackStore.songId === userReactionStore.songId) {
    return userReactionStore.score === 2 ? CL_FAV : userReactionStore.score === 1 ? CL_LIKE : ''
  }
})

// Non-reactive
let sending = false

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

function send (score: number) {
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
      windowsStore.alert('Please sign in to your Nightwave Plaza account to use the like button.', 'Error')
    }
  }).finally(() => {
    sending = false
  })
}

function showTip () {
  const showed = prefs.getInt('reactionTip', 0)
  if (showed > 0) return

  windowsStore.alert(`You have liked the song. Nice!<br />
                        Clicking the <i class="i icon-like"></i> button twice will add song to your favorites list. Give it a try!`,
    'N I C E', 'info')

  prefs.save('reactionTip', 1)
}

onMounted(() => {
  playerPlaybackStore.$subscribe((mutation, state) => {
    userReactionStore.load()
  })
})
</script>
