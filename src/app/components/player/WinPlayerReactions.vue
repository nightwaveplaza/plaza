<template>
  <win-button block :disabled="isLoading" @click="handleLikeClick">
    <i :class="likeIcon" class="i me-1" :style="{color: likeColor}" />
    {{ totalReactions }}
  </win-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { useReactions } from '@app/composables/useReactions.ts'
import { useLocalStorage } from '@vueuse/core'
import { useApi } from '@app/composables/useApi.ts'
import { reactionApi } from '@app/api/reaction.api.ts'
import type { ApiError } from '@app/utils/apiErrorHandler.ts'

const CL_FAV = '#FFD300'
const CL_LIKE = '#c12727'

const { t } = useI18n()
const { showAlert } = useWindows()
const { reactions: totalReactions } = useNowPlayingStatus()
const { reaction, setReaction, isCurrent } = useReactions()

const { execute: sendReaction, isLoading } = useApi(reactionApi.sendReaction)

const reactionTip = useLocalStorage('reactionTip', 0)

const likeIcon = computed(() => reaction.value.rate > 1 ? 'icon-favorite' : 'icon-like')
const likeColor = computed(() => {
  if (!isCurrent.value) return ''
  const colors: Record<number, string> = { 1: CL_LIKE, 2: CL_FAV }
  return colors[reaction.value.rate] ?? ''
})

async function handleLikeClick() {
  if (isLoading.value) return

  if (!isCurrent.value) {
    setReaction(0)
  }

  const nextScoreMap: Record<number, number> = { 0: 1, 1: 2, 2: 0 }
  const nextScore = nextScoreMap[reaction.value.rate] ?? 1

  await send(nextScore)
}

async function send(score: number) {
  try {
    const res = await sendReaction({ reaction: score })
    totalReactions.value = res.reactions
    setReaction(score)

    showTip()
  } catch (e) {
    const err = e as ApiError
    const msg = err.code === 401 ? t('errors.please_sign') : err.message
    showAlert(msg, t('errors.error'))
  }
}

function showTip() {
  if (reactionTip.value > 0) return

  showAlert(t('messages.reaction_tip'), t('messages.nice'), 'info')
  reactionTip.value = 1
}
</script>
