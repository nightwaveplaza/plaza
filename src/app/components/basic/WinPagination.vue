<template>
  <div class="row no-gutters pagination">
    <div v-if="page > 1" class="col-4 pr-1">
      <win-button class="d-block" @click="nextPage(-1)" :disabled="props.disabled">
        <i class="i icon-left-hand" />
      </win-button>
    </div>
    <div class="col-4">
      <input ref="pageInput" v-model.number="page" type="number" class="d-block" @keydown="useNumberOnly" :readonly="props.disabled">
    </div>
    <div v-if="pages > 1 && page < pages" class="col-4 pl-1">
      <win-button class="d-block" @click="nextPage(1)" :disabled="props.disabled">
        <i class="i icon-right-hand" />
      </win-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
