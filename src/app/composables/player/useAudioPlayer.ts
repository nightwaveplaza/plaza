import Hls from 'hls.js'
import { watch } from 'vue'
import { useVolumeControl } from '@app/composables/player/useVolumeControl.ts'
import { PlayerState } from '@app/types/types.ts'
import { useVisual } from '@app/composables/player/useVisual.ts'
import { useAppSettings } from '@app/composables/useAppSettings.ts'
import { useNowPlayingStatus } from '@app/composables/player/useNowPlayingStatus.ts'
import { usePlayerPlayback } from '@app/composables/player/usePlayerPlayback.ts'

/**
 * useAudioPlayer composable
 *
 * Controls HTML5 audio playback and handle MediaSession API actions
 */
export function useAudioPlayer(): {
  playAudio: () => void;
  stopAudio: () => void;
  setVisualCanvas: (canvas: HTMLCanvasElement) => void
} {
  const { volume } = useVolumeControl()
  const { startVisual, stopVisual } = useVisual()
  const { useHls, lowQuality } = useAppSettings()
  const { song, position } = useNowPlayingStatus()
  const { state, setState, setSleepTime } = usePlayerPlayback()

  let hls: Hls | null = null
  let audio: HTMLAudioElement | null = null
  let visualCanvas: HTMLCanvasElement | null = null

  // Watch for volume changes and adjust audio volume
  watch(volume, (newVolume) => {
    if (audio) {
      audio.volume = newVolume / 100
    }
  })

  // Watch for song update and change MediaSession and document title
  watch(() => song.id, () => {
    updateAudioMetadata()
  })

  // Set reference to <canvas> element to use with useVisual
  const setVisualCanvas = (canvas: HTMLCanvasElement): void => {
    visualCanvas = canvas
  }

  // Create <audio> object and play music
  const playAudio = (): void => {
    audio = document.createElement('audio')
    audio.crossOrigin = 'anonymous'

    // Use HLS if supported
    if (Hls.isSupported() && useHls.value) {
      hls = new Hls()
      hls.loadSource('https://radio.plaza.one/hls')
      hls.attachMedia(audio)
      if (lowQuality.value) {
        hls.currentLevel = 0
      }
    } else {
      const noCacheStr = 'nocache=' + Date.now()
      if (lowQuality.value) {
        audio.src = 'https://radio.plaza.one/mp3_low?' + noCacheStr
      } else {
        audio.src = 'https://radio.plaza.one/mp3?' + noCacheStr
      }
    }

    audio.volume = volume.value / 100

    // Add listeners
    audio.addEventListener('play', onAudioPlayEvent)
    audio.addEventListener('pause', onAudioPauseEvent)

    // Set timer to 0
    setSleepTime(0)

    // Start playing
    audio.play().then(() => {
      setState(PlayerState.PLAYING)
      setMediaSessionActions()
      updateAudioMetadata()

      if (visualCanvas) {
        startVisual(audio!, visualCanvas)
      }
    })
  }

  // Stop playback
  const stopAudio = (): void => {
    setMediaSessionState('none')
    stopVisual()

    // Destroy HLS
    hls?.detachMedia()
    hls?.destroy()
    hls = null

    // Destroy audio
    audio?.removeEventListener('play', onAudioPlayEvent)
    audio?.removeEventListener('pause', onAudioPauseEvent)
    audio?.pause()
    audio?.remove()
    audio = null

    // Set current state
    setState(PlayerState.IDLE)
    setSleepTime(0)

    document.title = 'Nightwave Plaza - Online Vaporwave Radio'
  }

  // Update media session and document title
  const updateAudioMetadata = (): void => {
    if (state.value === PlayerState.PLAYING) {
      document.title = `${song.artist} - ${song.title}`
      updateMediaSession()
      updateMediaSessionPosition()
    }
  }

  // Update media session if supported
  function updateMediaSession (): void {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [
          { src: song.artwork_src ?? '', sizes: '500x500', type: 'image/jpg' },
        ],
      })
    } else {
      console.log('No media session')
    }
  }

  function onAudioPlayEvent(): void {
    setMediaSessionState('playing')
  }

  function onAudioPauseEvent(): void {
    setMediaSessionState('paused')
  }

  function setMediaSessionActions (): void {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', playAudio)
        navigator.mediaSession.setActionHandler('pause', stopAudio)
      } catch (e) {
        console.log(e)
      }
    }
  }

  function setMediaSessionState (state: MediaSessionPlaybackState): void {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state
    }
  }

  function updateMediaSessionPosition (): void {
    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: song.length,
        position: position.value
      });
    }
  }

  return { playAudio, stopAudio, setVisualCanvas }
}
