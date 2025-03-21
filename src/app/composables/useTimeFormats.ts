import { i18n } from '@locales/_i18n.ts'

export function useTimeFormats () {
  const fmtDuration = (seconds: number): string => {
    const min = String(Math.floor(seconds / 60))
    const sec = String(Math.floor(seconds % 60))
    return `${min.padStart(2, '0')}:${sec.padStart(2, '0')}`
  }

  const fmtDay = (timestamp: number): string => {
    return new Date(timestamp * 1e3).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { month: 'short', day: 'numeric' }
    )
  }

  const fmtDate = (timestamp: number): string => {
    return new Date(timestamp * 1e3).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { month: 'short', day: 'numeric', year: 'numeric' }
    )
  }

  const fmtTime = (timestamp: number): string => {
    return new Date(timestamp * 1e3).toLocaleString(
      i18n.global.locale.value as Intl.LocalesArgument,
      { hour: 'numeric', minute: 'numeric', hour12: false }
    )
  }

  return { fmtDuration, fmtDay, fmtDate, fmtTime }
}
