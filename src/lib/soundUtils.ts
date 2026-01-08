// Sound utility for timer completion notifications

// Generate a simple chime sound using Web Audio API
export function playCompletionSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) {
      console.warn('Web Audio API not supported')
      return
    }

    const audioContext = new AudioContext()

    // Create a pleasant chime sound
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      // Envelope for smooth attack and release
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01) // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration) // Release

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    const now = audioContext.currentTime

    // Play a pleasant two-note chime
    playTone(523.25, now, 0.3) // C5
    playTone(659.25, now + 0.15, 0.4) // E5

    // Clean up
    setTimeout(() => {
      audioContext.close()
    }, 600)
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}
