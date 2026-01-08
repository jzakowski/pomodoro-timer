# Manual Test Guide: Browser Notifications Toggle (Issue #19)

## Prerequisites
✅ App is running at http://localhost:3000
✅ Browser supports Notification API (Chrome, Firefox, Edge, Safari)

## Test Steps

### Step 1: Navigate to Settings Tab
1. Open http://localhost:3000 in your browser
2. Click on the "Settings" tab in the navigation

**Expected Result:**
- Settings page loads
- You see a "Notifications & Sound" section
- Browser Notifications toggle is visible

---

### Step 2: Verify Initial State
Before clicking anything, check:

**Visual Checks:**
- [ ] Toggle is in OFF position (gray, left-aligned knob)
- [ ] Bell icon shows "BellOff" (bell with slash)
- [ ] Status message shows: "Click toggle to enable notifications"
- [ ] Status box has gray background
- [ ] Label reads: "Browser Notifications"
- [ ] Description reads: "Receive notifications when timer completes"
- [ ] Toggle is clickable (not disabled)

**Console Check:**
- Open DevTools (F12 or Cmd+Option+I)
- Check Console tab for any errors
- Expected: No errors related to settings or notifications

---

### Step 3: Enable Notifications
1. Click the toggle switch to turn it ON

**Expected Results:**

**A. Permission Dialog:**
- [ ] Browser shows permission prompt:
  ```
  "pomodoro-timer" wants to
  Show notifications
  [ Block ] [ Allow ]
  ```
- [ ] If you see this, click "Allow"

**B. After Allowing:**
- [ ] Toggle moves to ON position (blue, right-aligned knob)
- [ ] Bell icon changes to "Bell" (bell without slash)
- [ ] Status message changes to: "Notifications enabled"
- [ ] Status box has green background with checkmark icon
- [ ] Toggle shows blue color (`bg-blue-600` in dark mode, `bg-blue-500` in light mode)

**C. Console Check:**
- [ ] No errors in console
- [ ] Permission granted: Check by typing `Notification.permission` in console → should return `"granted"`

---

### Step 4: Test Persistence
1. Refresh the page (Cmd+R or F5)
2. Go back to Settings tab

**Expected Result:**
- [ ] Toggle remains ON (blue, right-aligned)
- [ ] Status still shows "Notifications enabled"
- [ ] Settings persisted to localStorage

**Verification:**
- Open DevTools → Application → Local Storage
- Find key `pomodoro_settings`
- Check that `browserNotificationsEnabled: true`

---

### Step 5: Disable Notifications
1. Click the toggle switch to turn it OFF

**Expected Result:**
- [ ] Toggle moves to OFF position (gray, left-aligned)
- [ ] Bell icon changes back to "BellOff"
- [ ] Status message changes back to: "Click toggle to enable notifications"
- [ ] Status box has gray background

---

### Step 6: Test Permission Denied State
This tests graceful handling of denied permissions:

1. Reset permissions (Chrome):
   - Click lock icon in address bar
   - Find "Notifications" → Set to "Block"
   - Refresh page

**OR** use console:
```javascript
// In browser console
Notification.permission = 'denied' // Note: This won't actually change it, for demo only
```

2. Go to Settings tab

**Expected Result:**
- [ ] Toggle is disabled (grayed out, opacity reduced)
- [ ] Toggle cannot be clicked
- [ ] Status message shows: "Permission denied. Enable in browser settings."
- [ ] Status box has red background with X icon
- [ ] Toggle shows `cursor-not-allowed` on hover

---

### Step 7: Test Unsupported Browser (Optional)
If you have access to a browser that doesn't support notifications:

**Expected Result:**
- [ ] Status shows: "Not supported in this browser"
- [ ] Toggle is disabled
- [ ] Status box has gray background with alert icon

---

## UI/UX Polish Checklist

### Visual Design:
- [ ] Toggle animation is smooth (150ms transition)
- [ ] Colors match design system (blue for ON, gray for OFF)
- [ ] Icons are properly aligned (5 w-5 h-5)
- [ ] Spacing is consistent (gap-3 between icon and text)
- [ ] Typography is clean (medium for label, regular for description)

### Accessibility:
- [ ] Toggle has `role="switch"`
- [ ] Toggle has proper `aria-checked` attribute ("true" or "false")
- [ ] Toggle has `aria-label="Toggle browser notifications"`
- [ ] Toggle has visible focus ring (2px, blue-500)
- [ ] Disabled toggle shows reduced opacity (50%)

### Dark Mode:
- [ ] Toggle colors work in both light and dark mode
- [ ] Status backgrounds are readable in dark mode (red-900/20, green-900/20)
- [ ] Text colors are readable (text-gray-900/white, text-gray-600/400)

---

## Acceptance Criteria

### Functional Requirements:
✅ Toggle requests permission when turned ON
✅ Permission dialog appears on first enable
✅ Toggle state updates based on permission
✅ Settings persist across page reloads
✅ Graceful handling of denied permissions
✅ Toggle disabled when not supported or denied

### UI Requirements:
✅ Professional, polished appearance
✅ Clear status messages
✅ Smooth animations
✅ Works in light and dark mode
✅ Accessible (keyboard, screen reader)

### Technical Requirements:
✅ No console errors
✅ Settings saved to localStorage
✅ TypeScript compiles without errors
✅ Build succeeds

---

## Test Results

**Date:** __________

**Browser:** __________

**Tester:** __________

| Test Step | Status | Notes |
|-----------|--------|-------|
| Step 1: Navigate to Settings | ☐ Pass ☐ Fail | |
| Step 2: Verify Initial State | ☐ Pass ☐ Fail | |
| Step 3: Enable Notifications | ☐ Pass ☐ Fail | |
| Step 4: Test Persistence | ☐ Pass ☐ Fail | |
| Step 5: Disable Notifications | ☐ Pass ☐ Fail | |
| Step 6: Test Permission Denied | ☐ Pass ☐ Fail | |
| UI/UX Polish | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ PASS ☐ FAIL

**Issues Found:**
_______________________________________________________________
_______________________________________________________________

**Screenshot of Settings Tab:** (Attach below)

---

## Console Verification

Run these commands in browser console to verify:

```javascript
// 1. Check if settings context is loaded
console.log('Settings loaded:', !!window.localStorage.getItem('pomodoro_settings'))

// 2. Check current permission
console.log('Notification permission:', Notification.permission)

// 3. Check settings object
const settings = JSON.parse(localStorage.getItem('pomodoro_settings'))
console.log('Browser notifications enabled:', settings?.browserNotificationsEnabled)

// 4. Toggle notifications programmatically (for testing)
// This should trigger permission dialog if not granted
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission)
})
```

---

## Edge Cases to Test

1. **Rapid toggle clicking:** Click ON/OFF quickly → Should handle gracefully
2. **Refresh during permission request:** Reload page while dialog is open → Should not crash
3. **Multiple tabs:** Open app in 2 tabs → Settings sync via localStorage
4. **Offline mode:** Disconnect internet → Toggle still works (client-side only)
5. **Private browsing:** Test in incognito → Should work the same

---

## Common Issues & Solutions

### Issue: Permission dialog doesn't appear
**Solution:** Check if already granted → `Notification.permission` in console

### Issue: Toggle won't turn on
**Solution:** Check if permission was previously denied → Reset in browser settings

### Issue: Status not updating
**Solution:** Check console for errors, verify settingsContext is properly loaded

### Issue: Not persisting after refresh
**Solution:** Check localStorage is enabled, check browser settings

---

## Notes for Developers

- Settings stored in: `localStorage['pomodoro_settings']`
- Context: `SettingsContext` in `/src/lib/settingsContext.tsx`
- Component: `SettingsTab` in `/src/components/SettingsTab.tsx`
- Permission API: `Notification.requestPermission()`
- Permission state: `Notification.permission` ('granted', 'denied', 'default', 'unsupported')
