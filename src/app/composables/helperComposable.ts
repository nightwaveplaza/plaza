import { i18n } from '@locales/_i18n'

export default function (): {
  dur: (seconds: number) => string;
  sd: (date: number) => string;
  sdy: (date: number) => string;
  gt: (date: number) => string
} {
  function dur (seconds: number): string {
    return new Date(seconds * 1000).toISOString().substring(14, 19)
  }

  function sd (date: number): string {
    return new Date(date * 1e3).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { month: 'short', day: 'numeric' }
    )
  }

  function sdy (date: number): string {
    return new Date(date * 1e3).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { month: 'short', day: 'numeric', year: 'numeric' }
    )
  }

  function gt (date: number): string {
    return new Date(date * 1e3).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { hour: 'numeric', minute: 'numeric', hour12: false }
    )
  }

  return { dur, sd, sdy, gt }
}
