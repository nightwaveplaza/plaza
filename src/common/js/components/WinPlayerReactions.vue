<template>
  <win-btn block @click="like"><i :class="likeIcon" class="i mr-1" :style="{color: likeColor}"/>
    {{ playerPlaybackStore.reactions }}
  </win-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { api } from '@common/js/api/api'
import { usePlayerPlaybackStore } from '@common/js/stores/playerPlaybackStore'
import { useUserReactionStore } from '@common/js/stores/userReactionStore'
import { useWindowsStore } from '@common/js/stores/windowsStore'
import { prefs } from '@common/js/extras/prefs'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const { t } = useI18n()
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
  if (playerPlaybackStore.songId !== userReactionStore.songId) {
    userReactionStore.score = 0
  }

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

  api.reactions.react(score).then(res => {
    playerPlaybackStore.reactions = res.data.reactions
    userReactionStore.score = score
    userReactionStore.songId = playerPlaybackStore.songId
    showTip()
  }).catch(e => {
    if (e instanceof AxiosError && e.response!.status === 401) {
      windowsStore.alert(t('alert.please_sign.message'), t('alert.please_sign.title'))
    }
  }).finally(() => {
    sending = false
  })
}

function showTip () {
  const showed = prefs.get<number>('reactionTip', 0)
  if (showed > 0) return

  windowsStore.alert(
      t('alert.reaction_tip.message', {icon: '<i class="i icon-like"></i>'}),
      t('alert.reaction_tip.title'),
      'info'
  )

  prefs.save('reactionTip', 1)
}
</script>
