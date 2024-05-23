<template>
  <div class="row no-gutters pagination">
    <div v-if="page > 1" class="col-4 pr-1">
      <win-btn class="d-block" @click="nextPage(-1)">
        <i class="i icon-left-hand" />
      </win-btn>
    </div>
    <div class="col-4">
      <input ref="pageInput" type="number" class="d-block" value="1" @change="setPage">
    </div>
    <div v-if="pages > 1 && page < pages" class="col-4 pl-1">
      <win-btn class="d-block" @click="nextPage(1)">
        <i class="i icon-right-hand" />
      </win-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  pages: number
}>()

const emit = defineEmits(['change'])

const pageInput = ref<HTMLInputElement | null>(null)
const page = ref(1)

function nextPage (dir: number): void {
  let newPage = page.value + dir
  if (newPage < 1) {
    newPage = 1
  }
  if (newPage > props.pages!) {
    newPage = props.pages!
  }
  page.value = newPage
}

function setPage (e: Event): void {
  const newPage = parseInt((e.target as HTMLInputElement).value, 10)
  if (!isNaN(newPage) && newPage > 0 && newPage <= props.pages) {
    page.value = newPage
  }
}

function reset (): void {
  page.value = 1
}

watch(page, (value) => {
  pageInput.value!.value = value.toString()
  emit('change', value)
})

defineExpose({
  pageInput, reset,
})
</script>
