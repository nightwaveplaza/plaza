/**
 * Ticker - more accurate than setInterval
 */

export default {
  handles: {},   // Timers
  lastTicked: 0, // Last global tick
  tickInterval: 300, // Interval between ticks

  /**
   * Random string for timer ID
   * @returns {string}
   */
  rnd: () => Math.random().toString(36).substring(2, 15),

  /**
   * Set timer
   * @param func callback
   * @param timeout interval
   * @returns {string} timer ID
   */
  set(func, timeout) {
    const n = this.rnd() + this.rnd();
    this.handles[n] = {
      func, timeout, lastTicked: 0, busy: false,
    };
    return n;
  },

  /**
   * Stop timer
   * @param n name
   */
  stop(n) {
    delete this.handles[n];
  },

  /**
   * Тик таймера (вызывается из requestAnimationFrame)
   */
  tick() {
    const now = Date.now();
    if (now - this.lastTicked < this.tickInterval) {
      return;
    }

    // Foreach timers
    for (const [n, h] of Object.entries(this.handles)) {
      if (now - h.lastTicked >= h.timeout) {
        this.handle(n).then(); // run
      }
    }

    this.lastTicked = Date.now();
  },

  /**
   * Run callback without overlapping
   * @param n
   * @returns {Promise<void>}
   */
  async handle(n) {
    if (!this.handles[n].busy) {
      this.handles[n].busy = true;
      await this.handles[n].func();
      this.handles[n].busy = false;
    }
    this.handles[n].lastTicked = Date.now();
  },
};
