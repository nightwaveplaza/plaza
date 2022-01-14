/**
 * Global helpers
 */
import {addZeros, playTime, shortDate, shortDateYear, getTime} from '@common/js/extras/utils';

export default {
  methods: {
    addZeros, shortDate, shortDateYear, playTime, getTime
  },

  computed: {
    isMobile() {
      return process.env.APP === 'mobile';
    }
  }
}
