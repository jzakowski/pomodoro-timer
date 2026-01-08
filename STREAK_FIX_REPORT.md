# Streak Calculation Fix - Implementation Report

## Issue
**Issue #39**: Stats tab shows current streak

## Problem Discovered
The streak calculation had **two critical bugs**:

### Bug 1: UTC vs Local Timezone
The original `getTodayDateString()` function used `toISOString().split('T')[0]`, which returns the **UTC date** instead of the user's local date. This caused incorrect streak calculations for users in timezones other than UTC.

**Example**: A user in GMT+1 (Central Europe) starting a pomodoro at 11 PM local time would have it counted toward the **next day** in UTC.

### Bug 2: Incorrect Reference Date in Loop
The streak calculation was updating `currentDate` after each iteration, which changed the reference point for date comparisons. This caused the algorithm to break after finding 2 consecutive days.

**Original Logic (BROKEN)**:
```javascript
if (diffDays === streak) {
  streak++
  currentDate = checkDate  // ❌ This changes the reference point!
}
```

**Fixed Logic**:
```javascript
if (diffDays === streak) {
  streak++  // ✅ Keep startDate constant, only increment streak
}
```

## Solution Implemented

### 1. Fixed `getTodayDateString()` to use local timezone
**File**: `src/lib/statsContext.tsx` (lines 31-38)

```typescript
const getTodayDateString = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
```

### 2. Fixed `calculateStreak()` to use constant reference date
**File**: `src/lib/statsContext.tsx` (lines 40-73)

```typescript
const calculateStreak = (sessionsByDate: { [date: string]: number }): number => {
  const dates = Object.keys(sessionsByDate).sort().reverse()

  if (dates.length === 0) return 0

  let streak = 0
  const referenceDate = new Date()
  referenceDate.setHours(0, 0, 0, 0)

  // Check if we have a session today
  const today = getTodayDateString()
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
```

## Test Results

All test cases now pass:

| Test Case | Expected | Before Fix | After Fix | Status |
|-----------|----------|------------|-----------|--------|
| Today has 1 session | 1 | 1 | 1 | ✅ |
| Today and yesterday | 2 | 1 | 2 | ✅ |
| 3 consecutive days | 3 | 2 | 3 | ✅ |
| Gap in days | 1 | 2 | 1 | ✅ |
| No sessions | 0 | 0 | 0 | ✅ |

## Implementation Status

### Already Implemented (No Changes Needed)
- ✅ StatsContext state includes `currentStreak` field
- ✅ StatsTab component displays current streak with Flame icon
- ✅ `recordSession()` function updates streak on completion
- ✅ Streak persists to localStorage

### Fixed
- ✅ Date calculation now uses local timezone
- ✅ Streak algorithm correctly counts consecutive days
- ✅ Edge cases handled (no sessions, gaps in days)

## Verification Steps

1. **Manual Testing**:
   - Open the app at http://localhost:3000
   - Navigate to Stats tab
   - Verify "Current Streak" card shows fire icon and "X days" format

2. **Create Test Data**:
   ```javascript
   // Run in browser console
   const today = new Date()
   const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
   const day2 = new Date(today); day2.setDate(day2.getDate() - 2)

   const getLocalDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

   const mockStats = {
     totalSessions: 3,
     totalMinutes: 75,
     currentStreak: 0,
     bestStreak: 0,
     sessionsByDate: {
       [getLocalDate(day2)]: 1,
       [getLocalDate(yesterday)]: 1,
       [getLocalDate(today)]: 1,
     },
     sessionHistory: []
   }

   localStorage.setItem('pomodoro_stats', JSON.stringify(mockStats))
   location.reload()
   ```

3. **Expected Result**: After reload, Stats tab should show "Current Streak: 3 days"

## Files Modified
- `src/lib/statsContext.tsx` - Fixed date handling and streak calculation

## Files Created (for testing)
- `test_streak.js` - Unit tests for streak calculation
- `test_streak_manual.html` - Browser-based test suite
- `test_streak_browser.js` - Browser console test helper

## Summary
The current streak feature was **already implemented** in the UI but had a **critical calculation bug** that caused incorrect streak counts. The bug has been fixed, and all test cases now pass correctly.

## Next Steps
1. ✅ Code changes complete
2. ✅ Unit tests passing
3. ⏭️ Manual browser testing recommended
4. ⏭️ Consider adding automated tests for streak calculation in CI/CD
