import { ref } from 'vue';
import { usePrefs } from '@/composables/usePrefs';


/**
 * useVolumeControl composable
 * 
 * This composable manages the volume state for the application.
 * It retrieves the initial volume from localStorage (via usePrefs) using a default value of 100 (i.e., 100% volume).
 * Any changes to the volume are automatically persisted back to localStorage.
 *
 * The volume is expected to be in the range 0–100, and the audio components will convert this percentage to a normalized value (0–1) as needed.
 */
export function useVolumeControl() {
    // Initialize volume from local storage with default value of 100 (100% volume)
    const volume = ref(usePrefs.get<number>('volume', 100)); // default to 100

    // Updates volume value and immediately persists it to localStorage
    const setVolume = (newVolume: number): void => {
        volume.value = newVolume;
        usePrefs.save<number>('volume', newVolume);
    };

    return { volume, setVolume };
}
