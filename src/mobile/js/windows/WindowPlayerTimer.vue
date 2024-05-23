<template>
  <win-window ref="win" :width="250" name="player-timer" title="Sleep Timer" v-slot="winProps">
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
          <win-btn block @click="winProps.close()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script setup lang="ts">
import { Native } from '@mobile/js/bridge/native'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNativeStateStore } from '@mobile/js/stores/nativeStateStore'
import WinWindow from '@common/js/components/WinWindow.vue'

const nativeStateStore = useNativeStateStore()

const win = ref<InstanceType<typeof WinWindow>>()

const minutes = ref(20)
const timeText = ref('Not set')

const active = computed(() => nativeStateStore.sleepTime !== 0 && nativeStateStore.sleepTime > Date.now())
const btnText = computed(() => nativeStateStore.sleepTime !== 0 ? 'Stop' : 'Start')

// Non-reactive
let intervalId = 0

function start () {
  if (active.value) {
    Native.setSleepTimer(0)
    nativeStateStore.sleepTime = 0
  } else {
    nativeStateStore.sleepTime = Date.now() + (minutes.value * 60 * 1000)
    Native.setSleepTimer(minutes.value)
  }

  win.value!.close()
}

function refreshText () {
  const t = nativeStateStore.sleepTime - Date.now()
  timeText.value = t < 0 ? 'Not set' : new Date(t).toISOString().substring(11, 19)
}

function add (amount: number) {
  let newMinutes = minutes.value
  newMinutes = newMinutes ? minutes.value + amount : 0
  minutes.value = newMinutes <= 0 ? 1 : newMinutes
}

onMounted(() => {
  intervalId = window.setInterval(refreshText, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

</script>
