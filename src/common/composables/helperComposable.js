import { computed } from 'vue'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export default function () {
  const isMobile = computed(() => process.env.APP === 'mobile')

  function dur(seconds) {
    return dayjs.duration(seconds * 1000).format('mm:ss')
  }

  function sdy(date) {
    return dayjs.unix(date).format('MMM DD, YYYY')
  }

  return { isMobile, dur, sdy }
}
