<template>
  <win-window ref="window" :width="280" name="settings-background" title="Appearance Settings">
    <div class="p-2">
      <div class="group-box p-2 mb-3">
        <div class="gb-label noselect">Background</div>

        <div class="row palette no-gutters" v-if="currentBackground.mode === 2">
          <div class="col-auto" v-for="color in palette">
            <button class="color" :style="{backgroundColor: color}" @click="changeColor(color)"/>
          </div>
          <div class="col-3">
            <input class="d-block" :value="selected" @change="colorSelected"/>
          </div>
        </div>

        <win-memo v-else>
          <p>
            <b>Background:</b> {{ currentBackground.image.num }}
          </p>
          <p>
            <b>Source:</b>
            <a v-if="currentBackground.image.source_link !== ''" :href="currentBackground.image.source_link">
              {{ currentBackground.image.source }}
            </a>
          </p>
          <p>
            <b>Author:</b>
            <a v-if="currentBackground.image.author_link !== ''" :href="currentBackground.image.author_link">
              {{ currentBackground.image.author }}
            </a>
          </p>
        </win-memo>

        <div class="row no-gutters mt-2 noselect">
          <div class="col-2 pr-1">
            <win-btn block @click="next(-1)">&lt;</win-btn>
          </div>
          <div class="col-2 pr-1">
            <win-btn block @click="next(1)">&gt;</win-btn>
          </div>
          <div class="col-4 pr-1">
            <win-btn block @click="random">Random</win-btn>
          </div>
          <div class="col-4">
            <win-btn block :class="{active: currentBackground.mode === 2}" @click="solid">Solid</win-btn>
          </div>
        </div>

        <div class="mt-1 noselect">
          <small>All background images were found on the Internet. Do you know the author? <a
              href="mailto:mail@plaza.one">Let us know!</a></small>
        </div>
      </div>

      <div class="group-box p-2 mb-2">
        <div class="gb-label noselect">Theme</div>
        <div class="select">
          <select @change="themeSelected">
            <option v-for="item in themes" :value="item[0]" v-html="item[1]" :selected="theme === item[0]"/>
          </select>
        </div>
      </div>

      <div class="text-center">
        <win-btn class="mx-auto px-4" @click="closeWindow()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script>
import settings from '@base/extras/settings';
import {Background} from '@base/extras/background';
import {background} from '@base/api/api';

export default {
  data() {
    return {
      currentBackground: {},
      backgrounds: [],
      selected: '',
      palette: [
        '#ffffff', '#000000', '#c0c0c0', '#808080', '#ff0000', '#800000', '#ffff00', '#808000', '#00ff00',
        '#008000', '#00ffff', '#008080', '#0000ff', '#000080', '#ff00ff', '#800080',
      ],
      theme: 'win98',
      themes: [
        ['desert', 'Desert'],
        ['contrast', 'High Contrast'],
        ['rainy', 'Rainy Day'],
        ['rose', 'Rose'],
        ['win98', 'Windows Standard'],
      ],
    };
  },

  beforeMount() {
    this.currentBackground = Background.loadSettings();
  },

  mounted() {
    background.get().then((result) => this.backgrounds = result.data);
    this.selected = this.currentBackground.color;
    this.theme = settings.load('theme') ?? 'win98';
  },

  methods: {
    next(direction) {
      this.currentBackground = Background.nextBackground(this.backgrounds, direction);
      this.set();
    },

    random() {
      this.currentBackground = Background.randomBackground(this.backgrounds);
      this.set();
    },

    solid() {
      this.currentBackground = Background.solidBackground();
      this.set();
    },

    set() {
      this.$emit('bgChanged', this.currentBackground);
    },

    changeColor(color) {
      this.selected = color;
      this.currentBackground = Background.setSolidColor(color);
      this.set();
    },

    colorSelected(e) {
      this.selected = e.target.value;
      this.changeColor(this.selected);
    },

    themeSelected(event) {
      const theme = event.target.value;
      settings.save('theme', theme);
      this.$emit('themeChanged', theme);
    },
  },
};
</script>
