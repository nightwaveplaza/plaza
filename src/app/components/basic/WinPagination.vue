<template>
  <div class="row gx-0 pagination">
    <div v-if="page > 1" class="col-4 pe-1">
      <win-button class="d-block" :disabled="props.disabled" @click="nextPage(-1)">
        <i class="i icon-left-hand" />
      </win-button>
    </div>
    <div class="col-4">
      <input ref="pageInput" v-model.number="page" type="number" class="d-block" :readonly="props.disabled" @keydown="useNumberOnly">
    </div>
    <div v-if="pages > 1 && page < pages" class="col-4 ps-1">
      <win-button class="d-block" :disabled="props.disabled" @click="nextPage(1)">
        <i class="i icon-right-hand" />
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNumberOnly } from '@app/utils/helpers.ts'

const props = withDefaults(defineProps<{
  pages: number,
  disabled: boolean
}>(), {
  pages: 1,
  disabled: false
})

const emit = defineEmits(['change'])

const page = ref(1)

function nextPage (dir: number): void {
  let newPage = page.value + dir
  if (newPage < 1) {
    newPage = 1
  }
  if (newPage > props.pages) {
    newPage = props.pages
  }
  page.value = newPage
  emit('change', newPage)
}

function reset (): void {
  page.value = 1
  emit('change', page.value)
}

defineExpose({
  reset,
})
</script>
