/**
 * Global helpers
 */
import * as dayjs from 'dayjs';
// import * as duration from 'dayjs/plugin/duration'
// dayjs.extend(duration)

export default {
  methods: {


    sd(date) {
      return dayjs.unix(date).format('MMM DD')
    },
  },

  computed: {
    isMobile() {
      return process.env.APP === 'mobile';
    },
  },
};
