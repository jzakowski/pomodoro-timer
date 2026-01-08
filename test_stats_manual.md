# Manual Test: Stats Update Automatically After Session Completion

## Test Steps

1. **Open the app** at http://localhost:3000

2. **Navigate to Stats tab** (click the Stats button in navigation)
   - Note the current session count (should be 0 initially)

3. **Navigate to Timer tab** (click the Timer button)

4. **Simulate a session completion** by opening DevTools Console and running:
   ```javascript
   // Add a completed work session
   const sessionData = {
     type: 'work',
     duration: 1500, // 25 minutes
     timestamp: Date.now()
   };
   const pendingSessions = JSON.parse(localStorage.getItem('pomodoro_pending_sessions') || '[]');
   pendingSessions.push(sessionData);
   localStorage.setItem('pomodoro_pending_sessions', JSON.stringify(pendingSessions));
   window.dispatchEvent(new Event('local-storage'));
   ```

5. **Navigate to Stats tab** again

6. **Verify**:
   - ✓ Session count should have increased by 1
   - ✓ Focus time should show 25m
   - ✓ Total Sessions should match

## Expected Result

Stats should update **automatically** without requiring a page refresh or any manual action.

## Technical Details

The auto-update works through:
1. Timer context records completed sessions to `pomodoro_pending_sessions` in localStorage
2. Stats context listens for 'local-storage' events
3. When event fires, stats context processes pending sessions and updates state
4. StatsTab component re-renders with new data automatically
