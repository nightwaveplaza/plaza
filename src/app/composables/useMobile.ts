export function useMobile() {
    return import.meta.env.VITE_APP === 'mobile'
}