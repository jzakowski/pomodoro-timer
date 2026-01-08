import { TimerProvider } from '@/lib/timerContext'
import TimerDisplay from '@/components/TimerDisplay'

export default function Home() {
  return (
    <TimerProvider>
      <TimerDisplay />
    </TimerProvider>
  )
}
