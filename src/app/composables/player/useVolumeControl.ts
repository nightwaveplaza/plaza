import { useLocalStorage } from '@vueuse/core'

/**
 * useVolumeControl composable
 * 
 * This composable manages the volume state for the application.
 * It retrieves the initial volume from localStorage (via prefs) using a default value of 100 (i.e., 100% volume).
 * Any changes to the volume are automatically persisted back to localStorage.
 *
 * The volume is expected to be in the range 0–100, and the audio components will convert this percentage to a normalized value (0–1) as needed.
 */

// Initialize volume from local storage with default value of 100 (100% volume)
// Keep ref outside of export function to not initialize it every time we use this composable
const volume = useLocalStorage<number>('volume', 100)

export function useVolumeControl() {
    return { volume }
}