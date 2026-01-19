<template>
  <div class="p-3">
    <div v-if="active" class="text-center">
      <p>{{ t('win.player_timer.title') }}</p>
      <p class="time-left mt-2">
        {{ fmtDuration(sleepTime / 1000) }}
      </p>
    </div>
    <div v-else class="text-center">
      <p class="text-center">
        {{ t('win.player_timer.info') }}
      </p>

      <div class="row gx-0 mt-3">
        <div class="col-2 pe-1">
          <win-button block @click="add(-10)">
            -10
          </win-button>
        </div>
        <div class="col-2 pe-1">
          <win-button block @click="add(-5)">
            -5
          </win-button>
        </div>
        <div class="col-4 pe-1">
          <input v-model.number="minutes" class="d-block text-center" type="number" @keydown="useNumberOnly">
        </div>
        <div class="col-2 pe-1">
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
    <div class="row mt-3 gx-0 justify-content-between">
      <div class="col-6">
        <win-button block class="fw-bold" @click="start()">
          {{ btnText }}
        </win-button>
      </div>
      <div class="col-4">
        <win-button block @click="closeWindow(Win.PLAYER_TIMER)">
          {{ t('buttons.close') }}
        </win-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNumberOnly } from '@app/utils/helpers.ts'
import { useWindows } from '@app/composables/useWindows.ts'
import { Win } from '@app/types'
import { usePlayerPlayback } from '@app/composables/player/usePlayerPlayback.ts'
import { fmtDuration } from '@app/utils/timeFormats.ts'

const { t } = useI18n()
const { closeWindow, showAlert } = useWindows()
const { sleepTime, setSleepTime } = usePlayerPlayback()

const minutes = ref(20)

const active = computed(() => sleepTime.value > 0)
const btnText = computed(() => active.value ? t('win.player_timer.stop') : t('win.player_timer.start'))
//const timeText = computed(() => new Date(timeLeft.value).toISOString().substring(11, 19))

function start (): void {
  if (active.value) {
    setSleepTime(0)
  } else {
    setSleepTime(minutes.value * 60 * 1000)
    showAlert(
        t('win.player_timer.alert', { minutes: minutes.value }),
        t('win.player_timer.timer_set'), 'info'
    )
  }

  closeWindow(Win.PLAYER_TIMER)
}

function add (amount: number): void {
  let newMinutes = minutes.value
  newMinutes = newMinutes ? minutes.value + amount : 0
  minutes.value = newMinutes <= 0 ? 1 : newMinutes
}
</script>

<style lang="scss">
#window-player-timer {
  .time-left {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
