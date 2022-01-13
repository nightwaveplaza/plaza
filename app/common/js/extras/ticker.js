/**
 * Ticker - более точный аналог setInterval
 */

export default {
  handles: {},   // Таймеры
  lastTicked: 0, // Последний тик

  /**
   * Случайная строка (айди таймера)
   * @returns {string}
   */
  rnd: () => Math.random().toString(36).substring(2, 15),

  /**
   * Установить таймер
   * @param func коллбэк
   * @param timeout интервал в мс
   * @returns {string} айдишник таймера
   */
  set(func, timeout) {
    const n = this.rnd() + this.rnd();
    this.handles[n] = {
      func, timeout, lastTicked: 0, busy: false
    };
    return n;
  },

  /**
   * Удалить таймер
   * @param n
   */
  stop(n) {
    delete this.handles[n];
  },

  /**
   * Тик таймера (вызывается из requestAnimationFrame)
   */
  tick() {
    // Чтобы снизить нагрузку, тикать будем нечасто
    const now = Date.now();
    if (now - this.lastTicked < 300) {
      return;
    }

    // Перебираем таймеры
    for (const [n, h] of Object.entries(this.handles)) {
      if (now - h.lastTicked >= h.timeout) {
        this.handle(n).then();
      }
    }

    this.lastTicked = Date.now();
  },

  /**
   * Запускаем коллбэк
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
  }
};
