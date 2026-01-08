/**
 * Add test sessions to localStorage for testing
 * Run this in browser console to populate test data
 */

(function addTestSessions() {
  const today = new Date().toISOString().split('T')[0]

  const testSessions = [
    { timestamp: Date.now() - 7200000, type: 'work', duration: 1500, date: today }, // 25 min ago
    { timestamp: Date.now() - 3600000, type: 'work', duration: 1500, date: today }, // 1 hour ago
    { timestamp: Date.now() - 1800000, type: 'work', duration: 1500, date: today }, // 30 min ago
  ]

  // Get existing sessions
  const existing = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]')

  // Add test sessions
  const updated = [...existing, ...testSessions]

  // Save to localStorage
  localStorage.setItem('pomodoro_sessions', JSON.stringify(updated))

  console.log('✅ Added 3 test work sessions')
  console.log('📊 Total sessions:', updated.length)
  console.log('🔄 Refresh the page to see the stats update')
})()
