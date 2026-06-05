<template>
  <win-button class="w-100" :disabled="isLoading" :icon="icon" @click="handleLikeClick">
    {{ totalReactions }}
  </win-button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts';
  import { useReactions } from '@app/composables/useReactions.ts';
  import { useLocalStorage } from '@vueuse/core';
  import { useApi } from '@app/composables/useApi.ts';
  import { reactionApi } from '@app/api/reaction.api.ts';
  import type { ApiError } from '@app/utils/apiErrorHandler.ts';

  const { t } = useI18n();
  const { showAlert } = useWindows();
  const { reactions: totalReactions } = useNowPlayingStatus();
  const { reaction, setReaction, isCurrent } = useReactions();

  const { execute: sendReaction, isLoading } = useApi(reactionApi.sendReaction);

  const reactionTip = useLocalStorage('reactionTip', 0);

  const icon = computed(() => {
    if (!isCurrent.value) return 'heart_gray';
    const colors: Record<number, string> = { 1: 'heart', 2: 'star' };
    return colors[reaction.value.rate] ?? 'heart_gray';
  });

  async function handleLikeClick() {
    if (isLoading.value) return;

    if (!isCurrent.value) {
      setReaction(0);
    }

    const nextScoreMap: Record<number, number> = { 0: 1, 1: 2, 2: 0 };
    const nextScore = nextScoreMap[reaction.value.rate] ?? 1;

    await send(nextScore);
  }

  async function send(score: number) {
    try {
      const res = await sendReaction({ reaction: score });
      totalReactions.value = res.reactions;
      setReaction(score);

      showTip();
    } catch (e) {
      const err = e as ApiError;
      const msg = err.code === 401 ? t('errors.please_sign') : err.message;
      showAlert(msg, t('errors.error'));
    }
  }

  function showTip() {
    if (reactionTip.value > 0) return;

    showAlert(t('messages.reaction_tip'), t('messages.nice'), 'info');
    reactionTip.value = 1;
  }
</script>
