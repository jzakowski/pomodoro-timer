export type NotificationSound = 'chime' | 'bell' | 'gong'

// Sound frequencies and patterns for Web Audio API
const SOUND_PATTERNS = {
  chime: {
    frequencies: [880, 1100, 1320], // A5, C#6, E6 - gentle major chord
    durations: [0.3, 0.2, 0.3],
  },
  bell: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 - classic bell chord
    durations: [0.4, 0.3, 0.4],
  },
  gong: {
    frequencies: [196, 220, 246.94], // G3, A3, B3 - deep gong
    durations: [0.8, 0.6, 0.8],
  },
}

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

/**
 * Play a notification sound with volume control
 * @param sound - The type of sound to play
 * @param volume - Volume level (0-100)
 */
export function playNotificationSound(sound: NotificationSound, volume: number): void {
  try {
    const ctx = getAudioContext()
    const pattern = SOUND_PATTERNS[sound]

    // Convert volume from 0-100 to 0-1
    const gainValue = Math.max(0, Math.min(100, volume)) / 100

    // Resume audio context if suspended (required for user gesture)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime

    // Create and play each note in the pattern
    pattern.frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, now)

      // Envelope for smooth attack and release
      const duration = pattern.durations[index]
      const startTime = now + index * 0.1

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.01) // Attack
      gainNode.gain.exponentialRampToValueAtTime(gainValue * 0.7, startTime + duration * 0.3) // Decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration) // Release

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration + 0.1)
    })
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

/**
 * Show a browser notification
 * @param title - Notification title
 * @param body - Notification body
 */
export async function showBrowserNotification(title: string, body: string): Promise<void> {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'pomodoro-timer',
      })

      // Focus window when notification is clicked
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000)
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }
}
