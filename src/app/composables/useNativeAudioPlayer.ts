import { Native } from '@mobile/bridge/native.ts';
import { usePlayerPlayback } from '@app/composables/player/usePlayerPlayback.ts';

export function useNativeAudioPlayer() {
  const { sleepTime } = usePlayerPlayback();

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
