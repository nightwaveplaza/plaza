export function useMobile (): boolean {
  return import.meta.env.VITE_APP === 'mobile'
}
