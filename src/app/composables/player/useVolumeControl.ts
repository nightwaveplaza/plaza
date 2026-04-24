import { useLocalStorage } from '@vueuse/core';

// Initialize volume from local storage with default value of 100 (100% volume)
// Keep ref outside of export function to not initialize it every time we use this composable
const volume = useLocalStorage<number>('volume', 100);

export function useVolumeControl() {
  return { volume };
}
