import { Native } from '@mobile/bridge/native.ts';
import { useSleepTimer } from '@app/composables/useSleepTimer.ts';

export function useNativeAudioPlayer() {
  const { sleepTime } = useSleepTimer();

  const playAudio = () => {
    Native.playAudio();
    sleepTime.value = 0;
  };

  const stopAudio = () => {
    Native.stopAudio();
    sleepTime.value = 0;
  };

  const setVisualCanvas = () => {
    return null;
  };

  return { playAudio, stopAudio, setVisualCanvas };
}
