# Volume Slider Manual Test Guide

## Test Steps for Issue #17

### 1. Navigate to Settings Tab
- [ ] Open the app at http://localhost:3001
- [ ] Click on the "Settings" tab in the navigation (bottom on mobile, top on desktop)

### 2. Verify Volume Slider UI
- [ ] Locate the "Volume" slider in the "Notifications & Sound" section
- [ ] Verify it shows "50%" by default
- [ ] Verify the slider has a volume icon (Volume2) on the left
- [ ] Verify the percentage is displayed on the right
- [ ] Verify the slider shows 0%, 50%, 100% markers below it

### 3. Test Volume Slider Interaction
- [ ] Drag slider to 100%
- [ ] Verify percentage updates to "100%"
- [ ] Click "Preview" button
- [ ] Verify sound plays at loud volume

- [ ] Drag slider to 10%
- [ ] Verify percentage updates to "10%"
- [ ] Click "Preview" button
- [ ] Verify sound plays at very low volume

- [ ] Drag slider to 0%
- [ ] Verify percentage updates to "0%"
- [ ] Click "Preview" button
- [ ] Verify no sound plays (or barely audible)

- [ ] Drag slider to 75%
- [ ] Verify percentage updates to "75%"
- [ ] Click "Preview" button
- [ ] Verify sound plays at moderately high volume

### 4. Test Sound Toggle Integration
- [ ] Toggle "Sound Notifications" OFF
- [ ] Verify volume slider is disabled
- [ ] Verify slider appears grayed out
- [ ] Try to drag slider (should not work)
- [ ] Click "Preview" button (should be disabled and not work)

- [ ] Toggle "Sound Notifications" ON
- [ ] Verify sound plays automatically (preview)
- [ ] Verify volume slider is enabled
- [ ] Verify slider works normally

### 5. Test Sound Selector Integration
- [ ] Set volume to 50%
- [ ] Change sound selector to "Bell"
- [ ] Click "Preview" button
- [ ] Verify bell sound plays at medium volume

- [ ] Set volume to 100%
- [ ] Change sound selector to "Gong"
- [ ] Click "Preview" button
- [ ] Verify gong sound plays at loud volume

### 6. Test LocalStorage Persistence
- [ ] Set volume to 80%
- [ ] Refresh the page (F5 or Cmd+R)
- [ ] Navigate back to Settings tab
- [ ] Verify volume is still at 80%

- [ ] Close browser tab completely
- [ ] Open new tab and navigate to http://localhost:3001
- [ ] Go to Settings tab
- [ ] Verify volume persists at 80%

### 7. Test Edge Cases
- [ ] Try to drag slider below 0% (should stay at 0)
- [ ] Try to drag slider above 100% (should stay at 100)
- [ ] Rapidly move slider back and forth
- [ ] Verify UI updates smoothly without lag

### 8. Verify No Console Errors
- [ ] Open browser DevTools (F12 or Cmd+Option+I)
- [ ] Go to Console tab
- [ ] Perform all volume slider actions
- [ ] Verify no errors appear in console
- [ ] Verify no warnings appear in console

## Expected Results
✓ Volume slider responds smoothly to all interactions
✓ Sound volume changes appropriately based on slider position
✓ Settings persist across page refreshes and browser restarts
✓ UI elements enable/disable correctly based on sound toggle
✓ No console errors or warnings
✓ All three notification sounds work with volume control
