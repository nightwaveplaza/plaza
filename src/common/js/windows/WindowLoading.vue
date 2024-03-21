<template>
  <win-window :width="220" name="loading" title="Nightwave Plaza">
    <template v-slot:header>
      <div class="buttons"></div>
    </template>

    <div class="p-3">
      <p class="text-center"><strong>Loading...</strong></p>
      <div ref="bar" class="text-field progress-bar">
        <div ref="progress" :style="style" class="progress">
          <div/>
          <div/>
          <div/>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useWindowsStore } from '@common/js/stores/windowsStore'

const windowsStore = useWindowsStore()

// Reactive data
const style = ref({
  transform: `translate(0px, 0px)`,
})

// Refs
const bar = ref(null)
const progress = ref(null)

// Non-reactive
let movedAt = 0
let direction = 3
let left = 0
let loading = true

// Methods
function move () {
  if (!loading) {
    return
  }

  const now = Date.now()
  if (now - movedAt > 30 && bar.value) {
    if (left > bar.value.offsetWidth - progress.value.offsetWidth - 6 || left < 0) {
      direction *= -1
    }

    left += direction
    style.value.transform = `translate(${left}px, 0px)`
    movedAt = now
  }

  requestAnimationFrame(move)
}

onMounted(() => {
  windowsStore.pullUp('loading')
  move()
})

onBeforeUnmount(() => {
  loading = false
  windowsStore.pullUp('player')
})
</script>
