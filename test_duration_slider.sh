#!/bin/bash

# Test: Work duration slider updates timer (Issue #11)

echo "🧪 Testing Work Duration Slider Feature"
echo "========================================"
echo ""

# Check if app is running
echo "1️⃣ Checking if app is running..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "   ✅ App is running on http://localhost:3000"
else
  echo "   ❌ App is not running!"
  exit 1
fi
echo ""

# Check for Settings tab in HTML
echo "2️⃣ Checking for Settings tab in HTML..."
if curl -s http://localhost:3000 | grep -q "Settings"; then
  echo "   ✅ Settings tab found in page"
else
  echo "   ❌ Settings tab not found!"
  exit 1
fi
echo ""

# Check for settings context
echo "3️⃣ Checking for settingsContext..."
if [ -f "src/lib/settingsContext.tsx" ]; then
  echo "   ✅ settingsContext.tsx exists"
  if grep -q "workDuration" src/lib/settingsContext.tsx; then
    echo "   ✅ workDuration setting found"
  else
    echo "   ❌ workDuration setting not found!"
    exit 1
  fi
else
  echo "   ❌ settingsContext.tsx not found!"
  exit 1
fi
echo ""

# Check SettingsTab component
echo "4️⃣ Checking SettingsTab component..."
if [ -f "src/components/SettingsTab.tsx" ]; then
  echo "   ✅ SettingsTab.tsx exists"
  if grep -q "Work Duration" src/components/SettingsTab.tsx; then
    echo "   ✅ 'Work Duration' label found"
  else
    echo "   ❌ 'Work Duration' label not found!"
    exit 1
  fi
  if grep -q 'type="range"' src/components/SettingsTab.tsx; then
    echo "   ✅ Range slider input found"
  else
    echo "   ❌ Range slider input not found!"
    exit 1
  fi
else
  echo "   ❌ SettingsTab.tsx not found!"
  exit 1
fi
echo ""

# Check if timerContext uses settings
echo "5️⃣ Checking if timerContext uses settings..."
if grep -q "useSettings" src/lib/timerContext.tsx; then
  echo "   ✅ timerContext imports useSettings"
else
  echo "   ❌ timerContext doesn't import useSettings!"
  exit 1
fi
echo ""

# Check if SettingsProvider is in layout
echo "6️⃣ Checking if SettingsProvider is in layout..."
if grep -q "SettingsProvider" src/app/layout.tsx; then
  echo "   ✅ SettingsProvider found in layout"
else
  echo "   ❌ SettingsProvider not found in layout!"
  exit 1
fi
echo ""

echo "✅ All checks passed!"
echo ""
echo "📋 Manual Test Steps:"
echo "   1. Open http://localhost:3000"
echo "   2. Click on Settings tab"
echo "   3. Find 'Work Duration' slider (should show 25 by default)"
echo "   4. Drag slider to 30 minutes"
echo "   5. Return to Timer tab"
echo "   6. Verify timer now shows '30:00'"
echo ""
