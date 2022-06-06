export default {
  save: function(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  },
  load: function(name) {
    return JSON.parse(localStorage.getItem(name));
  },
};
