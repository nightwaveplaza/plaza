export function isMobile (): boolean {
  return import.meta.env.VITE_APP === 'mobile'
}

export function useNumberOnly (e: KeyboardEvent): void {
  if (e.key.length === 1 && isNaN(Number(e.key))) {
    e.preventDefault()
  }
}
