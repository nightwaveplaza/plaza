<template>
  <win-window :width="220" :name="name" title="Nightwave Plaza">
    <template #header>
      <div class="buttons" />
    </template>

    <div class="p-3">
      <p class="text-center">
        <strong>{{ t('loading') }}</strong>
      </p>
      <div ref="bar" class="text-field progress-bar">
        <div ref="progress" :style="style" class="progress">
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindows } from '@app/composables/useWindows.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { Win } from '@app/types'
import { isMobile } from '@app/utils/helpers.ts'
import { Native } from '@mobile/bridge/native.ts'

const { t } = useI18n()
const { openWindow, closeWindow } = useWindows()
const { song } = useNowPlayingStatus()

defineProps<{
  name: string
}>()

const style = ref({
  transform: `translate(0px, 0px)`,
})

const bar = ref<HTMLDivElement | null>(null)
const progress = ref<HTMLDivElement | null>(null)

// Non-reactive
let movedAt = 0
let direction = 3
let left = 0
let loading = true

function move (): void {
  if (!loading) {
    return
  }

  const now = Date.now()
  if (now - movedAt > 30 && bar.value) {
    if (left > bar.value!.offsetWidth - progress.value!.offsetWidth - 6 || left < 0) {
      direction *= -1
    }

    left += direction
    style.value.transform = `translate(${left}px, 0px)`
    movedAt = now
  }

  requestAnimationFrame(move)
}

// waiting for the first status response then check news and open up player
watch(() => song.id, async () => {
  openWindow(Win.PLAYER)
  closeWindow(Win.LOADING)
})

onMounted(() => {
  move()
  if (isMobile()) {
    Native.onReady()
  }
})

onBeforeUnmount(() => {
  loading = false
})
</script>

<style lang="scss">
#window-loading {
  .progress-bar {
    position: relative;
    margin: 12px 5px 0 5px;
    height: 20px;
    overflow: hidden;
    border: 1px solid #808080;
    border-right-color: #dfdfdf;
    border-bottom-color: #dfdfdf;
    padding: 0 6px;
    min-height: 14px;
  }

  .progress-bar .progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
  }

  .progress-bar .progress div {
    display: inline-block;
    margin: 1px;
    height: 16px;
    width: 10px;
    background: #072269;
  }
}
</style>
