import Hls from 'hls.js'
import { useSettingsStore } from '@app/stores/settingsStore.ts'
import { watch } from 'vue'
import { useVolumeControl } from '@app/composables/useVolumeControl.ts'
import { PlayerState } from '@app/types/types.ts'
import { usePlayerPlaybackStore } from '@app/stores/playerPlaybackStore.ts'
import useVisual from '@app/composables/useVisual.ts'
import { usePlayerSongStore } from '@app/stores/playerSongStore.ts'

/**
 * useAudioPlayer composable
 *
 * Controls HTML5 audio playback and handle MediaSession API actions
 */
export function useAudioPlayer() {
  const settingsStore = useSettingsStore()
  const playerPlayback = usePlayerPlaybackStore()
  const playerSongStore = usePlayerSongStore()
  const { volume } = useVolumeControl()
  const { startVisual, stopVisual } = useVisual()

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
  watch(() => playerSongStore.songId, () => {
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
    if (Hls.isSupported() && settingsStore.useHls) {
      hls = new Hls()
      hls.loadSource('https://radio.plaza.one/hls')
      hls.attachMedia(audio)
      if (settingsStore.lowQuality) {
        hls.currentLevel = 0
      }
    } else {
      const noCacheStr = 'nocache=' + Date.now()
      if (settingsStore.lowQuality) {
        audio.src = 'https://radio.plaza.one/mp3_low?' + noCacheStr
      } else {
        audio.src = 'https://radio.plaza.one/mp3?' + noCacheStr
      }
    }

    audio.volume = volume.value / 100

    // Add listeners
    audio.addEventListener('play', onAudioPlayEvent)
    audio.addEventListener('pause', onAudioPauseEvent)

    // Start playing
    audio.play().then(() => {
      playerPlayback.state = PlayerState.PLAYING
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
    playerPlayback.state = PlayerState.IDLE
    playerPlayback.sleepTime = 0

    document.title = 'Nightwave Plaza - Online Vaporwave Radio'
  }

  // Update media session and document title
  const updateAudioMetadata = (): void => {
    if (playerPlayback.state === PlayerState.PLAYING) {
      document.title = `${playerSongStore.artist} - ${playerSongStore.title}`
      updateMediaSession()
      updateMediaSessionPosition()
    }
  }

  // Update media session if supported
  function updateMediaSession (): void {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playerSongStore.title,
        artist: playerSongStore.artist,
        album: playerSongStore.album,
        artwork: [
          { src: playerSongStore.artwork_src, sizes: '500x500', type: 'image/jpg' },
        ],
      })
    } else {
      console.log('No media session')
    }
  }

  function onAudioPlayEvent() {
    setMediaSessionState('playing')
  }

  function onAudioPauseEvent() {
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

  function updateMediaSessionPosition () {
    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: playerSongStore.length,
        position: playerSongStore.position
      });
    }
  }

  return { playAudio, stopAudio, setVisualCanvas }
}
