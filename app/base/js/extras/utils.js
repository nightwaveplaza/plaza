/**
 * Dumb functions
 */
const utils = {
  addZeros: (num, pad) => {
    let res = num.toString();
    while (res.length < pad) res = '0' + res;
    return res;
  },

  shortDateYear: timestamp => {
    const d = new Date(timestamp * 1000);
    return d.toLocaleString('en-us', {month: 'short'}) + ' '
        + addZeros(d.getDate(), 2) + ', ' + d.getFullYear();
  },

  shortDate: timestamp => {
    const d = new Date(timestamp * 1000);
    return d.toLocaleString('en-us', {month: 'short'}) + ' ' +
        addZeros(d.getDate(), 2);
  },

  playTime: sec => {
    const time = parseFloat(sec).toFixed(3),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);
    return addZeros(minutes, 2) + ':' + addZeros(seconds, 2);
  },

  getTime: timestamp => new Date(timestamp * 1000).toTimeString().slice(0, 5),
};

export const addZeros = utils.addZeros;
export const shortDate = utils.shortDate;
export const shortDateYear = utils.shortDateYear;
export const playTime = utils.playTime;
export const getTime = utils.getTime;
