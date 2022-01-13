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
      // TODO use vuex
      return process.env.APP === 'mobile';
    }
  }
}
