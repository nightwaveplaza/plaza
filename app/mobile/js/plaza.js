window['plaza'] = {
  vue: {},

  push: function(action, data) {
    if (action === 'openWindow') {
      this.vue.openWindow(data.window);
    }

    if (action === 'closeWindow') {
      this.vue.closeWindow(data.window);
    }

    this.vue.pushData(action, data);
  }
};
