<template>
  <div class="row gx-0 flex-nowrap pagination">
    <div v-if="activePage > 1" class="col-auto pe-1">
      <win-button
        class="d-block"
        :disabled="props.disabled"
        icon="left_arrow"
        @click="nextPage(-1)"
      />
    </div>
    <div class="col-auto">
      <input
        ref="pageInput"
        v-model.number="page"
        type="number"
        class="d-block"
        :readonly="props.disabled"
        @keydown="handleKeydown"
      />
    </div>
    <div v-if="pages > 1 && activePage < pages" class="col-auto ps-1">
      <win-button
        class="d-block"
        :disabled="props.disabled"
        icon="right_arrow"
        @click="nextPage(1)"
      />
    </div>
    <div v-if="isDirty" class="col-auto ps-1">
      <win-button class="d-block px-3" :disabled="props.disabled || !isValidDraft" @click="goToPage">
        {{ goLabel }}
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useNumberOnly } from '@app/utils/helpers.ts';

  const props = withDefaults(
    defineProps<{
      pages?: number;
      disabled?: boolean;
    }>(),
    {
      pages: 1,
      disabled: false,
    },
  );

  const emit = defineEmits(['change']);

  const { t } = useI18n();

  // page: draft value bound to the input. activePage: the page that's actually loaded.
  // Kept separate so the arrows always step from what's loaded, never from an unsaved draft.
  const page = ref(1);
  const activePage = ref(1);

  const isDirty = computed(() => page.value !== activePage.value);
  const isValidDraft = computed(() => {
    const value = Number(page.value);
    return Number.isInteger(value) && value >= 1 && value <= props.pages;
  });
  const goLabel = computed(() => {
    const value = Number(page.value);
    return Number.isFinite(value) ? t('pagination.go_to_page', { n: value }) : t('pagination.go');
  });

  function commit(newPage: number): void {
    page.value = newPage;
    activePage.value = newPage;
    emit('change', newPage);
  }

  function nextPage(dir: number): void {
    let newPage = activePage.value + dir;
    if (newPage < 1) {
      newPage = 1;
    }
    if (newPage > props.pages) {
      newPage = props.pages;
    }
    commit(newPage);
  }

  function goToPage(): void {
    if (props.disabled || !isDirty.value || !isValidDraft.value) {
      return;
    }
    commit(Number(page.value));
  }

  function handleKeydown(e: KeyboardEvent): void {
    useNumberOnly(e);
    if (e.key === 'Enter') {
      goToPage();
    }
  }

  function reset(): void {
    commit(1);
  }

  defineExpose({
    reset,
  });
</script>
