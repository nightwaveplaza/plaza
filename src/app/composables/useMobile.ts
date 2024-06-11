import {computed} from "vue";

export function useMobile() {
    return computed(() => import.meta.env.VITE_APP === 'mobile')
}