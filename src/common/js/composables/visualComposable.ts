export default function () {
  const VISUAL_BARS = 'rgba(255,255,255,0.6)'
  const MAX_FREQ_VISUAL = 14000

  let canvasWidth = 0
  let canvasHeight = 0
  let visualBars = 0
  let visualEnabled = false
  let context: AudioContext | null
  let analyser: AnalyserNode | null
  let source: MediaElementAudioSourceNode | null
  let canvas: HTMLCanvasElement | null
  let canvasContext: CanvasRenderingContext2D | null

  function startVisual (audio: HTMLAudioElement, cvs: HTMLCanvasElement) {
    if (!context || !source || !analyser) {
      context = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyser = context.createAnalyser()
      source = context.createMediaElementSource(audio)
    }

    source.connect(context.destination)
    source.connect(analyser)

    canvas = cvs
    canvasContext = canvas.getContext('2d')
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    canvasWidth = canvas.width
    canvasHeight = canvas.height
    analyser.fftSize = 512

    calcVisualFreqs()
    visualEnabled = true
    visualize()
  }

  function calcVisualFreqs () {
    const sampleRate = context!.sampleRate
    const freqStep = sampleRate / (analyser!.frequencyBinCount * 2)
    let endFreq = freqStep

    while (endFreq + freqStep < MAX_FREQ_VISUAL) {
      endFreq += freqStep
      visualBars += 1
    }
  }

  function visualize () {
    if (!visualEnabled) {
      return
    }

    requestAnimationFrame(visualize)
    canvasContext!.clearRect(0, 0, canvas!.clientWidth, canvas!.clientHeight)

    const frequencyData = new Uint8Array(analyser!.frequencyBinCount)
    analyser!.getByteFrequencyData(frequencyData)

    for (let i = 0; i < visualBars; i++) {
      const height = Math.ceil((canvasHeight * frequencyData[i]) / 255)
      const width = Math.ceil(canvasWidth / visualBars)
      canvasContext!.fillStyle = VISUAL_BARS
      canvasContext!.fillRect(i * width, canvasHeight - height, width, height)
    }
  }

  function stopVisual () {
    visualEnabled = false
    if (canvasContext) {
      canvasContext.clearRect(0, 0, canvas!.clientWidth, canvas!.clientHeight)
    }

    analyser!.disconnect()
    source!.disconnect()
    context = null
    source = null
  }

  return {
    startVisual, stopVisual,
  }
}
