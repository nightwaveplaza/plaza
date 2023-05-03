<template>
  <win-window ref="window" :width="250" name="player-timer" title="Sleep Timer">
    <div class="p-3">
      <p v-if="active" class="text-center">
        Sleep timer is active <br/> <b>{{ timeText }}</b>
      </p>
      <div v-else class="text-center">
        <p class="text-center">Set the time for the sleep timer. The music will stop automatically.</p>

        <div class="row no-gutters mt-3">
          <div class="col-2 pr-1">
            <win-btn block @click="add(-10)">-10</win-btn>
          </div>
          <div class="col-2 pr-1">
            <win-btn block @click="add(-5)">-5</win-btn>
          </div>
          <div class="col-4 pr-1">
            <input class="d-block text-center" v-model="minutes"
                   onkeypress="if(this.value.length > 3){return false;}"
                   type="number"/>
          </div>
          <div class="col-2 pr-1">
            <win-btn block @click="add(5)">+5</win-btn>
          </div>
          <div class="col-2">
            <win-btn block @click="add(10)">+10</win-btn>
          </div>
        </div>
      </div>


      <!-- Buttons -->
      <div class="row mt-3 no-gutters justify-content-between">
        <div class="col-6">
          <win-btn block class="text-bold" @click="start()">{{ btnText }}</win-btn>
        </div>
        <div class="col-4">
          <win-btn block @click="closeWindow2">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup>
import {Native} from '@mobile/js/bridge/native';
import { mapGetters, useStore } from 'vuex'
import ticker from '@common/js/extras/ticker';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import helperComposable from '@common/js/composables/helperComposable'
import windowsComposable from '@common/js/composables/windowsComposable'

const store = useStore()

// Composable
const { dur } = helperComposable()
const { closeWindow2 } = windowsComposable('player-timer')

// Reactive data
const minutes = ref(20)
const timeText = ref(0)
const sleepTime = computed(() => store.getters['sleepTime'])
const active = computed(() => sleepTime.value !== 0)
const btnText = computed(() => sleepTime.value !== 0 ? 'Stop' : 'Start')

// Non-reactive
let tickerId = 0

// Methods
function start() {
  if (active.value) {
    Native.setSleepTimer(0);
  } else {
    add(0); // hack: make minutes integer
    Native.setSleepTimer(minutes.value);
  }

  this.closeWindow();
}

function refreshText() {
  const t = (sleepTime.value - Date.now()) / 1000;
  timeText.value = t < 0 ? '00:00' : dur(t);
}

function add(amount) {
  let newMinutes = parseInt(minutes.value);
  newMinutes = newMinutes ? minutes.value + amount : 0;
  minutes.value = newMinutes <= 0 ? 1 : newMinutes;
}

onMounted(() => {
  tickerId = ticker.set(refreshText, 1000)
})

onBeforeUnmount(() => {
  ticker.stop(tickerId)
})

</script>
