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
import { usePrefs } from '@app/composables/usePrefs'
import { useWindows } from '@app/composables/useWindows.ts'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const { t } = useI18n()
const playerSongStore = usePlayerSongStore()
const userReactionStore = useUserReactionStore()
const { winAlert } = useWindows()

const likeIcon = computed(() => userReactionStore.score > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => userReactionStore.isCurrent ? {2: CL_FAV, 1: CL_LIKE}[userReactionStore.score] ?? '' : '')
const sending = ref(false)

function like (): void {
  if (!userReactionStore.isCurrent) {
    userReactionStore.setUserReaction(0)
  }

  // score map if we hit like when score == 1 then favorite, else remove. If no score, then like
  send({1: 2, 2: 0}[userReactionStore.score] ?? 1)
}

function send (score: number): void {
  sending.value = true

  api.reactions.react(score).then(res => {
    playerSongStore.reactions = res.data.reactions
    userReactionStore.setUserReaction(score)
    showTip()
  }).catch(e => {
    if (e instanceof AxiosError && e.response!.status === 401) {
      winAlert(t('errors.please_sign'), t('errors.error'))
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

  winAlert(t('messages.reaction_tip'), t('messages.nice'), 'info')

  usePrefs.save('reactionTip', 1)
}
</script>
