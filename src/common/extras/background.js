import settings from '@common/extras/settings';
import {background} from '@common/api/api';

const MODE_RANDOM = 0;
const MODE_SINGLE = 1;
const MODE_SOLID = 2;

const DEFAULT_SETTINGS = {
  index: 0,
  mode: MODE_RANDOM,
  image: {},
  color: '#008080',
};

export const Background = {
  saveSettings: (data) => settings.save('background_v2', data),
  loadSettings: () => settings.load('background_v2') ?? DEFAULT_SETTINGS,

  /**
   * Load saved settings on startup
   * @returns {Promise<*>}
   */
  async loadOnStartup() {
    let current = this.loadSettings();

    if (current.mode === MODE_RANDOM) {
      current.image = (await background.random()).data;
      this.saveSettings(current);
    }

    return current;
  },

  /**
   * Switch to the next background
   * @param items
   * @param direction // 1 for next and -1 for previous
   * @returns {*}
   */
  nextBackground(items, direction) {
    let current = this.loadSettings();
    let index = this.getIndex(items, current.image) + direction;

    if (index < 0) {
      index = items.length - 1;
    } else if (index >= items.length) {
      index = 0;
    }

    current.mode = MODE_SINGLE;
    current.image = items[index];
    this.saveSettings(current);
    return current;
  },

  /**
   * Find background index
   * @param items
   * @param background
   * @returns {number|*}
   */
  getIndex(items, background) {
    if (background === undefined) {
      return 0;
    }

    const index = items.findIndex((bg) => {
      return bg.id === background.id;
    });

    return index < 0 ? 0 : index;
  },

  /**
   * Select random background
   * @param items
   * @returns {number}
   */
  randomBackground(items) {
    let current = this.loadSettings();
    const index = Math.floor(Math.random() * items.length);
    current.mode = MODE_RANDOM;
    current.image = items[index];
    this.saveSettings(current);
    return current;
  },

  /**
   * Select solid background
   * @returns {*}
   */
  solidBackground() {
    let current = this.loadSettings();
    current.mode = MODE_SOLID;
    this.saveSettings(current);
    return current;
  },

  /**
   * Set solid background color
   * @param color
   * @returns {*}
   */
  setSolidColor(color) {
    let current = this.loadSettings();
    current.color = color;
    this.saveSettings(current);
    return current;
  },
};
