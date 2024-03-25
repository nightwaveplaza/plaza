import { computed } from 'vue'

export default function () {
  const isMobile = computed(() => import.meta.env.VITE_APP === 'mobile')

  function dur (seconds) {
    return new Date(seconds * 1000).toISOString().substring(14, 19)
  }

  function sd (date) {
    return new Date(date * 1e3).toLocaleString('en-US',
      { month: 'short', day: 'numeric' })
  }

  function sdy (date) {
    return new Date(date * 1e3).toLocaleString('en-US',
      { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function gt (date) {
    return new Date(date * 1e3).toLocaleString('en-US',
      { hour: 'numeric', minute: 'numeric', hour12: false })
  }

  return { isMobile, dur, sd, sdy, gt }
}
