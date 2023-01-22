<template>
  <div class="row no-gutters pagination">
    <div class="col-4 pr-1" v-if="page > 1">
      <win-btn class="d-block" @click="nextPage(-1)">
        <i class="i icon-left-hand"/>
      </win-btn>
    </div>
    <div class="col-4">
      <input ref="pageInput" type="number" class="d-block" value="1" @change="setPage"/>
    </div>
    <div class="col-4 pl-1" v-if="pages > 1 && page < pages">
      <win-btn class="d-block" @click="nextPage(1)">
        <i class="i icon-right-hand"/>
      </win-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  pages: Number,
})

// Emits
const emit = defineEmits(['change'])

// Reactive data
const pageInput = ref(null)
const page = ref(1)

watch(page, (value) => {
  pageInput.value.value = value
  emit('change', value)
})

// Methods
function nextPage (dir) {
  let newPage = page.value + dir
  if (newPage < 1) {
    newPage = 1
  }
  if (newPage > this.pages) {
    newPage = this.pages
  }
  page.value = newPage
}

function setPage (e) {
  const newPage = parseInt(e.target.value)
  if (!isNaN(newPage) && newPage > 0 && newPage <= props.pages) {
    page.value = newPage
  }
}

function reset () {
  page.value = 1
}

defineExpose({
  pageInput, reset
})
</script>
