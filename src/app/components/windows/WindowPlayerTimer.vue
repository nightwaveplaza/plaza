<template>
  <win-window ref="win" :width="250" name="player-timer" title="Sleep Timer" v-slot="winProps">
    <div class="p-3">
      <div v-if="active" class="text-center">
        <p>Sleep timer is active</p>
        <p class="time-left mt-2">{{ timeText }}</p>
      </div>
      <div v-else class="text-center">
        <p class="text-center">Set the time for the sleep timer. The music will stop automatically.</p>

        <div class="row no-gutters mt-3">
          <div class="col-2 pr-1">
            <win-button block @click="add(-10)">-10</win-button>
          </div>
          <div class="col-2 pr-1">
            <win-button block @click="add(-5)">-5</win-button>
          </div>
          <div class="col-4 pr-1">
            <input class="d-block text-center" v-model.number="minutes" @keydown="useNumberOnly" type="number" />
          </div>
          <div class="col-2 pr-1">
            <win-button block @click="add(5)">+5</win-button>
          </div>
          <div class="col-2">
            <win-button block @click="add(10)">+10</win-button>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-button block class="text-bold" @click="start()">{{ btnText }}</win-button>
        </div>
        <div class="col-4">
          <win-button block @click="winProps.close()">{{ t('buttons.close') }}</win-button>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import { useI18n } from 'vue-i18n'
import { useNumberOnly } from '@app/composables/useNumberOnly.ts'
import type WinWindow from '@app/components/basic/WinWindow.vue'

const { t } = useI18n()
const playerPlaybackStore = usePlayerPlaybackStore()

const win = ref<InstanceType<typeof WinWindow>>()

const minutes = ref(20)
const timeLeft = ref(0)

const active = computed(() => playerPlaybackStore.sleepTime !== 0 && playerPlaybackStore.sleepTime > Date.now())
const btnText = computed(() => playerPlaybackStore.sleepTime !== 0 ? 'Stop' : 'Start')
const timeText = computed(() => timeLeft.value < 0 ? 'Not set' : new Date(timeLeft.value).toISOString().substring(11, 19))

// Non-reactive
let intervalId = 0

function start () {
  if (active.value) {
    playerPlaybackStore.sleepTime = 0
  } else {
    playerPlaybackStore.sleepTime = Date.now() + (minutes.value * 60 * 1000)
  }
  updateTimeLeft()
  win.value!.close()
}

function add (amount: number) {
  let newMinutes = minutes.value
  newMinutes = newMinutes ? minutes.value + amount : 0
  minutes.value = newMinutes <= 0 ? 1 : newMinutes
}

function updateTimeLeft() {
  timeLeft.value = playerPlaybackStore.sleepTime - Date.now()
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