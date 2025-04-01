<template>
  <win-button block :disabled="sending" @click="like">
    <i :class="likeIcon" class="i mr-1" :style="{color: likeColor}" />
    {{ reactions }}
  </win-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { prefs } from '@app/utils/prefs.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { useReactionsApi } from '@app/composables/api'
import { useReactions } from '@app/composables/useReactions.ts'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const { t } = useI18n()
const { setReactions, reactions } = useNowPlayingStatus()
const { reaction, setReaction, isCurrent: isCurrentReaction } = useReactions()
const { winAlert } = useWindows()

const likeIcon = computed(() => reaction.rate > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => isCurrentReaction.value ? {2: CL_FAV, 1: CL_LIKE}[reaction.rate] ?? '' : '')
const { sendReaction } = useReactionsApi()
const { isLoading: sending, send: react } = sendReaction()

function like (): void {
  // Reset reaction if not current song
  if (!isCurrentReaction.value) {
    setReaction(0)
  }

  // rate map if we hit like when score == 1 then favorite, else remove. If no rate, then like
  send({1: 2, 2: 0}[reaction.rate] ?? 1)
}

function send (score: number): void {
  react(score).then(res => {
    setReactions(res.reactions)
    setReaction(score)
    showTip()
  }).catch(err => {
    if (err.code === 401) {
      winAlert(t('errors.please_sign'), t('errors.error'))
    } else {
      winAlert(err.message, t('errors.error'))
    }
  })
}

function showTip (): void {
  const showed = prefs.get<number>('reactionTip', 0)
  if (showed > 0) {
    return
  }
  winAlert(t('messages.reaction_tip'), t('messages.nice'), 'info')
  prefs.save('reactionTip', 1)
}

</script>
