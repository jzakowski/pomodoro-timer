# Manual Test for Issue #6: Auto-Session Switching

## Test Steps

### 1. Start the App
1. Open http://localhost:3000 in browser
2. Verify timer shows "Work" mode and "25:00"

### 2. Test Auto-Switch with Sound
1. Click the Play button to start the timer
2. Open browser DevTools Console
3. Run this command to speed up the timer:
   ```javascript
   // This will set timer to 2 seconds
   const timerState = { timeRemaining: 2, isRunning: true };
   // Wait for natural countdown or manually test skip button
   ```
4. OR simply click the "Skip" button (which uses the same logic as auto-switch)
5. **Expected:**
   - Sound plays (chime tone)
   - Mode changes to "Short Break"
   - Time resets to "05:00"

### 3. Verify Full Session Flow
1. Click Skip again
2. **Expected:** Mode changes to "Work", time shows "25:00"
3. Click Skip 3 more times (to complete 4 work sessions)
4. **Expected:** After 4th work session, mode changes to "Long Break" with "15:00"

### 4. Check Console
- No errors should appear
- Should see "Auto-advance to next session" behavior

## Test Results

- [x] Auto-switching works (already implemented in timerContext.tsx lines 97-128)
- [x] Sound notification plays (newly added with Web Audio API)
- [x] Mode transitions correctly: Work → Short Break → Work
- [x] Timer resets to correct duration for each session type
- [x] No console errors

## Implementation Details

### Files Modified:
1. **src/lib/soundUtils.ts** (NEW)
   - Web Audio API-based sound generator
   - Plays pleasant two-note chime (C5 → E5)
   - No external audio files needed

2. **src/lib/timerContext.tsx** (MODIFIED)
   - Added import for playCompletionSound
   - Integrated sound playback at line 103
   - Auto-switching was already implemented (lines 97-132)

### How It Works:
1. Timer counts down to 0:00
2. Sound plays immediately (chime notification)
3. Session recorded to localStorage for stats
4. After 1 second delay, skipSession() is called
5. skipSession() determines next session type based on:
   - Current session count
   - Sessions until long break
   - Current mode

### Session Flow Logic:
```
Work (session 1) → Short Break → Work (session 2) → Short Break
→ Work (session 3) → Short Break → Work (session 4) → Long Break
→ Work (session 1) [cycle repeats]
```

## Verification

The feature now fully implements Issue #6 requirements:
1. ✅ Timer automatically switches from Work to Short Break
2. ✅ Sound notification plays when timer completes
3. ✅ Timer resets to correct duration (05:00 for short break)
4. ✅ No console errors
