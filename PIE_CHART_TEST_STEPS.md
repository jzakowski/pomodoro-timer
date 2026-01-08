# Pie Chart Feature Test Steps

## Test Case 1: Empty State (No Sessions)

**Steps:**
1. Clear all stats by opening browser console and running:
   ```javascript
   localStorage.removeItem('pomodoro_stats')
   location.reload()
   ```

2. Navigate to Stats tab

**Expected Results:**
- Pie chart shows empty state message
- Message reads: "No sessions completed yet. Complete some sessions to see the distribution."
- No chart is displayed

---

## Test Case 2: Display with Sample Data

**Steps:**
1. Open browser console
2. Copy and paste the following to add sample data:
   ```javascript
   const sampleSessions = [
     { type: 'work', duration: 1500, completed: true, timestamp: Date.now() - 10000000 },
     { type: 'work', duration: 1500, completed: true, timestamp: Date.now() - 9000000 },
     { type: 'shortBreak', duration: 300, completed: true, timestamp: Date.now() - 8000000 },
     { type: 'work', duration: 1500, completed: true, timestamp: Date.now() - 7000000 },
     { type: 'work', duration: 1500, completed: true, timestamp: Date.now() - 6000000 },
     { type: 'longBreak', duration: 900, completed: true, timestamp: Date.now() - 5000000 },
     { type: 'work', duration: 1500, completed: true, timestamp: Date.now() - 4000000 },
     { type: 'shortBreak', duration: 300, completed: true, timestamp: Date.now() - 3000000 },
     { type: 'work', duration: 1500, completed: true, timestamp: Date.now() - 2000000 },
     { type: 'shortBreak', duration: 300, completed: true, timestamp: Date.now() - 1000000 },
   ]

   const currentStats = JSON.parse(localStorage.getItem('pomodoro_stats') || '{}')
   const updatedHistory = [...(currentStats.sessionHistory || []), ...sampleSessions]
   localStorage.setItem('pomodoro_stats', JSON.stringify({
     ...currentStats,
     sessionHistory: updatedHistory,
     totalSessions: updatedHistory.length,
   }))

   location.reload()
   ```

3. Navigate to Stats tab

**Expected Results:**
- Pie chart displays with 3 colored segments
- Red segment for Work sessions (5 sessions, 50%)
- Green segment for Short Break sessions (3 sessions, 30%)
- Purple segment for Long Break sessions (1 session, 10%)
- Legend shows correct counts and percentages
- Chart is centered and properly sized
- Colors match session types
- Total sessions displayed at bottom of legend

---

## Test Case 3: Real Session Updates

**Steps:**
1. Go to Timer tab
2. Start and complete a work session (25 minutes)
3. Navigate to Stats tab

**Expected Results:**
- Pie chart updates automatically
- Work segment increases by 1
- Percentages recalculate correctly
- No page refresh required

---

## Test Case 4: Different Session Combinations

**Steps:**
1. Test with only work sessions (should show single red segment)
2. Test with work + short break (2 segments)
3. Test with all three types (3 segments)

**Expected Results:**
- Chart dynamically adjusts to show only present session types
- Segments are proportional to session counts
- Colors remain consistent

---

## Test Case 5: Dark Mode

**Steps:**
1. Navigate to Settings
2. Toggle dark mode on
3. Navigate to Stats tab

**Expected Results:**
- Pie chart background adapts to dark mode
- Text remains readable
- Legend colors stay consistent
- No visual issues

---

## Test Case 6: Responsive Design

**Steps:**
1. View on desktop (1920x1080)
2. View on tablet (768x1024)
3. View on mobile (375x667)

**Expected Results:**
- Chart scales appropriately on all screen sizes
- Legend moves below chart on mobile
- No horizontal scrolling
- Touch-friendly layout

---

## Visual Acceptance Criteria

✅ Pie chart is circular and symmetrical
✅ Segments have clean edges
✅ Colors are vibrant and match session types:
   - Work: Red (#EF4444)
   - Short Break: Green (#10B981)
   - Long Break: Purple (#8B5CF6)
✅ Legend is aligned and readable
✅ Percentages add up to 100%
✅ Total session count is accurate
✅ Empty state is helpful and clear
✅ No console errors

---

## Manual Testing Checklist

- [ ] Empty state displays correctly with no data
- [ ] Pie chart appears with sample data
- [ ] All three session types show correct colors
- [ ] Legend displays accurate counts and percentages
- [ ] Chart updates after completing a real session
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile, tablet, and desktop
- [ ] No console errors
- [ ] Smooth animations and transitions
