<template>
  <win-button block :disabled="sending" @click="like">
    <i :class="likeIcon" class="i mr-1" :style="{color: likeColor}" />
    {{ playerSongStore.reactions }}
  </win-button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { api } from '@app/api/api'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'
import { useUserReactionStore } from '@app/stores/userReactionStore'
import { useWindowsStore } from '@app/stores/windowsStore'
import { usePrefs } from '@app/composables/usePrefs'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const { t } = useI18n()
const playerSongStore = usePlayerSongStore()
const { userReaction, setUserReaction } = useUserReactionStore()
const windowsStore = useWindowsStore()

const likeIcon = computed(() => userReaction.score > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => {
  if (playerSongStore.songId === userReaction.songId) {
    return userReaction.score === 2 ? CL_FAV : userReaction.score === 1 ? CL_LIKE : ''
  } else {
    return ''
  }
})
const sending = ref(false)

// Methods
function like (): void {
  if (playerSongStore.songId !== userReaction.songId) {
    setUserReaction(0)
  }

  // score map if we hit like when score == 1 then favorite, else remove. If no score, then like
  send({1: 2, 2: 0}[userReaction.score] ?? 1)
}

function send (score: number): void {
  sending.value = true

  api.reactions.react(score).then(res => {
    playerSongStore.reactions = res.data.reactions
    setUserReaction(score)
    showTip()
  }).catch(e => {
    if (e instanceof AxiosError && e.response!.status === 401) {
      windowsStore.alert(t('errors.please_sign'), t('errors.error'))
    }
  }).finally(() => {
    sending.value = false
  })
}

function showTip (): void {
  const showed = usePrefs.get<number>('reactionTip', 0)
  if (showed > 0) {
    return
  }

  windowsStore.alert(t('messages.reaction_tip'), t('messages.nice'), 'info')

  usePrefs.save('reactionTip', 1)
}
</script>
