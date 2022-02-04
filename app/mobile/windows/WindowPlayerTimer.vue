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
          <win-btn block @click="closeWindow()">Close</win-btn>
        </div>
      </div>
    </div>
  </win-window>
</template>

<script>
import {Native} from '@mobile/bridge/native';
import {mapGetters} from 'vuex';
import ticker from '@base/extras/ticker';

export default {
  data() {
    return {
      minutes: 20,
      timeText: 0,
    };
  },

  async mounted() {
    this.tickerId = ticker.set(this.refreshText, 1000);
  },

  beforeDestroy() {
    ticker.stop(this.tickerId);
  },

  methods: {
    start() {
      if (this.active) {
        Native.setSleepTimer(0);
      } else {
        this.add(0); // hack: make minutes integer
        Native.setSleepTimer(this.minutes);
      }

      this.closeWindow();
    },

    refreshText() {
      const t = (this.sleepTime - Date.now()) / 1000;
      this.timeText = t < 0 ? '00:00' : this.playTime(t);
    },

    add(amount) {
      let minutes = parseInt(this.minutes);
      minutes = minutes ? minutes + amount : 0;
      this.minutes = minutes <= 0 ? 1 : minutes;
    },
  },

  computed: {
    ...mapGetters([
      'sleepTime',
    ]),
    active() {
      return this.sleepTime !== 0;
    },
    btnText() {
      return this.sleepTime !== 0 ? 'Stop' : 'Start';
    },
  },
};
</script>
