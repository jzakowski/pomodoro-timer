import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: 'A beautiful Pomodoro Timer application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
