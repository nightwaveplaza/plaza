<template>
  <div :id="'window-' + name" ref="frame" class="frame row align-items-center">
    <div :class="{alert: isAlert, 'fluid-height': fluidHeight}" class="win98 col pl-0 pr-0">
      <div ref="window" :style="style" class="window" @mousedown="pullUp">
        <div class="inner">
          <div class="header header-draggable noselect" @dblclick="resetPosition" @mousedown="startMove"
               :class="{inactive: isWindowInactive}">
            <div class="icon"></div>
            {{ title }}
            <slot name="header">
              <div class="buttons">
                <win-btn class="button-close" @click="close"><span/></win-btn>
              </div>
            </slot>

          </div>

          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

const SNAP_SIZE = 15;

export default {
  data() {
    return {
      style: {
        zIndex: 100,
        position: 'relative',
        left: '0px',
        top: '0px',
        transform: '',
        width: ''
      },

      windowDefaultPosition: [0, 0],
      windowPos: [0, 0],
      borders: [0, 0],
      moving: false,
    };
  },

  watch: {
    windowPos() {
      this.style.left = this.windowPos[0] + 'px';
      this.style.top = this.windowPos[1] + 'px';
    },
  },

  props: {
    title: {
      type: String,
    },
    name: {
      type: String,
    },
    isAlert: {
      type: Boolean,
    },
    width: {
      type: Number,
      default: 500,
    },
    fluidHeight: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters('windows', ['activeWindow', 'globalZ', 'isWindowOpen']),
    isWindowInactive() {
      return this.activeWindow !== this.name;
    },
  },

  methods: {
    resetPosition() {
      this.windowPos = [0, 0];
    },

    pullUp() {
      this.$store.commit('windows/pullUp', this.name);
      this.style.zIndex = this.globalZ;
    },

    startMove(event) {
      if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SPAN') {
        return;
      }

      this.recalculatePositions();
      this.moving = true;
      this.offsets = [event.offsetX, event.offsetY];
    },

    move(event) {
      if (!this.moving) return;
      event.preventDefault();

      const mousePos = [event.clientX - this.offsets[0], event.clientY - this.offsets[1]];
      let x = mousePos[0] - this.windowDefaultPosition[0];
      let y = mousePos[1] - this.windowDefaultPosition[1];

      if (mousePos[0] - SNAP_SIZE <= 0) {
        x = 0 - this.windowDefaultPosition[0];
      }

      if (mousePos[1] - SNAP_SIZE <= 0) {
        y = 0 - this.windowDefaultPosition[1];
      }

      if (mousePos[0] + SNAP_SIZE >= this.borders[0]) {
        x = this.windowDefaultPosition[0];
      }

      if (mousePos[1] + SNAP_SIZE >= this.borders[1]) {
        y = this.borders[1] - this.windowDefaultPosition[1];
      }

      this.windowPos = [x, y];
    },

    stopMove(event) {
      if (!this.moving) return;
      event.preventDefault();

      this.moving = false;
    },

    recalculatePositions() {
      const borders = [
        window.innerWidth - this.$refs['window'].offsetWidth,
        window.innerHeight - this.$refs['window'].offsetHeight,
      ];

      if (this.windowPos[0] === 0 && this.windowPos[1] === 0) {
        const rect = this.$refs['window'].getBoundingClientRect();
        this.windowDefaultPosition = [rect.x, rect.y];
      } else {
        this.windowDefaultPosition[0] += (borders[0] - this.borders[0]) / 2;
        this.windowDefaultPosition[1] += (borders[1] - this.borders[1]) / 2;
      }

      this.borders = borders;
    },

    close() {
      this.closeWindow(this.name);
    },
  },

  mounted() {
    this.style.zIndex = this.globalZ;
    this.style.width = this.width + 'px';

    if (this.width > 0 && this.width <= 320) {
      this.style.maxWidth = this.width + 'px';
    }

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'windows/pullUp' && this.name === state.windows.activeWindow) {
        this.style.zIndex = state.windows.activeZIndex;
      }
    });

    window.addEventListener('mouseup', this.stopMove);
    window.addEventListener('mousemove', this.move);
    window.addEventListener('resize', this.recalculatePositions);
  },

  destroyed() {
    window.removeEventListener('mouseup', this.stopMove);
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('resize', this.recalculatePositions);
  },
};
</script>
