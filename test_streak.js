// Test script to verify streak calculation (WITH LOCAL DATES)

// Helper to get local date string (matching the implementation)
const getLocalDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calculateStreak = (sessionsByDate) => {
  const dates = Object.keys(sessionsByDate).sort().reverse()

  if (dates.length === 0) return 0

  let streak = 0
  const referenceDate = new Date()
  referenceDate.setHours(0, 0, 0, 0)

  // Check if we have a session today
  const today = getLocalDateString(referenceDate)
  const startDate = dates[0] !== today ? new Date(dates[0]) : referenceDate
  startDate.setHours(0, 0, 0, 0)

  for (const dateStr of dates) {
    // Parse date string (creates date at local midnight, not UTC)
    const checkDate = new Date(dateStr)
    checkDate.setHours(0, 0, 0, 0)

    const diffTime = startDate.getTime() - checkDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // For the first iteration (streak=0), we need diffDays=0 (same day)
    // For subsequent iterations, we need diffDays=streak (consecutive days)
    if (diffDays === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Test Case 1: Today has 1 session (should be streak = 1)
const today = new Date()
const test1 = {
  [getLocalDateString(today)]: 1
}
console.log('Test 1 - Today has 1 session:', calculateStreak(test1), '(expected: 1)')

// Test Case 2: Today and yesterday have sessions (should be streak = 2)
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const test2 = {
  [getLocalDateString(today)]: 1,
  [getLocalDateString(yesterday)]: 2
}
console.log('Test 2 - Today and yesterday:', calculateStreak(test2), '(expected: 2)')

// Test Case 3: Sessions 3 days in a row (should be streak = 3)
const day2 = new Date(today)
day2.setDate(day2.getDate() - 2)
const test3 = {
  [getLocalDateString(today)]: 1,
  [getLocalDateString(yesterday)]: 1,
  [getLocalDateString(day2)]: 1
}
console.log('Test 3 - 3 days in a row:', calculateStreak(test3), '(expected: 3)')

// Test Case 4: Sessions today, but gap yesterday (should be streak = 1)
const dayBefore = new Date(today)
dayBefore.setDate(dayBefore.getDate() - 2)
const test4 = {
  [getLocalDateString(today)]: 1,
  [getLocalDateString(dayBefore)]: 1
}
console.log('Test 4 - Gap in days:', calculateStreak(test4), '(expected: 1)')

// Test Case 5: No sessions (should be streak = 0)
const test5 = {}
console.log('Test 5 - No sessions:', calculateStreak(test5), '(expected: 0)')

console.log('\n✅ All streak calculation tests completed!')
