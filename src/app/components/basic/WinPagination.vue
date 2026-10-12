<template>
  <div class="row gx-0 pagination">
    <div v-if="activePage > 1" class="col-4 pe-1">
      <win-button
        class="d-block"
        :disabled="props.disabled"
        icon="left_arrow"
        @click="nextPage(-1)"
      />
    </div>
    <div class="col-4">
      <input
        ref="pageInput"
        v-model.number="page"
        type="number"
        class="d-block"
        :readonly="props.disabled"
        @keydown="useNumberOnly"
        @change="applyInput"
      />
    </div>
    <div v-if="pages > 1 && activePage < pages" class="col-4 ps-1">
      <win-button
        class="d-block"
        :disabled="props.disabled"
        icon="right_arrow"
        @click="nextPage(1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
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

  const page = ref(1);
  const activePage = ref(1);

  function setPage(newPage: number): void {
    newPage = Math.min(Math.max(newPage, 1), props.pages);
    page.value = newPage;
    if (newPage !== activePage.value) {
      activePage.value = newPage;
      emit('change', newPage);
    }
  }

  function nextPage(dir: number): void {
    setPage(activePage.value + dir);
  }

  function applyInput(): void {
    const value = Math.round(Number(page.value));
    if (!value) {
      page.value = activePage.value;
      return;
    }
    setPage(value);
  }

  function reset(): void {
    page.value = 1;
    activePage.value = 1;
    emit('change', 1);
  }

  defineExpose({
    reset,
  });
</script>
