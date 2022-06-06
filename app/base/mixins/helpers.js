/**
 * Global helpers
 */
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export default {
  methods: {
    dur(seconds) {
      return dayjs.duration(seconds * 1000).format('mm:ss')
    },

    sd(date) {
      return dayjs.unix(date).format('MMM DD')
    },

    sdy(date) {
      return dayjs.unix(date).format('MMM DD, YYYY')
    }
  },

  computed: {
    isMobile() {
      return process.env.APP === 'mobile';
    },
  },
};
