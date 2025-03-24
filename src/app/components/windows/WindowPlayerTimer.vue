<template>
  <win-window ref="win" v-slot="winProps" :width="250" :name="name" :title="t('win.player_timer.title')">
    <div class="p-3">
      <div v-if="active" class="text-center">
        <p>{{ t('win.player_timer.title') }}</p>
        <p class="time-left mt-2">
          {{ timeText }}
        </p>
      </div>
      <div v-else class="text-center">
        <p class="text-center">
          {{ t('win.player_timer.info') }}
        </p>

        <div class="row no-gutters mt-3">
          <div class="col-2 pr-1">
            <win-button block @click="add(-10)">
              -10
            </win-button>
          </div>
          <div class="col-2 pr-1">
            <win-button block @click="add(-5)">
              -5
            </win-button>
          </div>
          <div class="col-4 pr-1">
            <input v-model.number="minutes" class="d-block text-center" type="number" @keydown="useNumberOnly">
          </div>
          <div class="col-2 pr-1">
            <win-button block @click="add(5)">
              +5
            </win-button>
          </div>
          <div class="col-2">
            <win-button block @click="add(10)">
              +10
            </win-button>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-button block class="text-bold" @click="start()">
            {{ btnText }}
          </win-button>
        </div>
        <div class="col-4">
          <win-button block @click="winProps.close()">
            {{ t('buttons.close') }}
          </win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { useI18n } from 'vue-i18n'
import { useNumberOnly } from '@app/utils/helpers.ts'
import { useWindows } from '@app/composables/useWindows.ts'

const { t } = useI18n()
const playerPlayback = usePlayerPlaybackStore()
const { closeWindow, WinType, winAlert } = useWindows()

defineProps<{
  name: string
}>()

const minutes = ref(20)
const timeLeft = ref(0)

const active = computed(() =>
    playerPlayback.sleepTime !== 0 && playerPlayback.sleepTime > Date.now())
const btnText = computed(() =>
    playerPlayback.sleepTime !== 0 ? t('win.player_timer.stop') : t('win.player_timer.start'))
const timeText = computed(() => new Date(timeLeft.value).toISOString().substring(11, 19))

// Non-reactive
let intervalId = 0

function start (): void {
  if (active.value) {
    playerPlayback.sleepTime = 0
  } else {
    playerPlayback.sleepTime = Date.now() + (minutes.value * 60 * 1000)
    winAlert(
        t('win.player_timer.alert', { minutes: minutes.value }),
        t('win.player_timer.timer_set'), 'info'
    )
  }

  updateTimeLeft()
  closeWindow(WinType.PLAYER_TIMER)
}

function add (amount: number): void {
  let newMinutes = minutes.value
  newMinutes = newMinutes ? minutes.value + amount : 0
  minutes.value = newMinutes <= 0 ? 1 : newMinutes
}

function updateTimeLeft (): void {
  timeLeft.value = playerPlayback.sleepTime - Date.now()
}

onMounted(() => {
  updateTimeLeft()
  intervalId = window.setInterval(updateTimeLeft, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style lang="scss">
#window-player-timer {
  .time-left {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
