#!/bin/bash

# Simple test for stats auto-update feature

echo "🧪 Testing: Stats update automatically after session completion"
echo ""

# Check if app is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ App is not running on http://localhost:3000"
    echo "Please start the app with: npm run dev"
    exit 1
fi

echo "✓ App is running"
echo ""

echo "📋 Manual Test Instructions:"
echo ""
echo "1. Open http://localhost:3000 in your browser"
echo "2. Click on the Stats tab"
echo "3. Note the current session count (should be 0)"
echo "4. Click on the Timer tab"
echo "5. Open browser DevTools (F12) and go to Console"
echo "6. Paste and run this code:"
echo ""
echo "   const sessionData = {"
echo "     type: 'work',"
echo "     duration: 1500,"
echo "     timestamp: Date.now()"
echo "   };"
echo "   const pending = JSON.parse(localStorage.getItem('pomodoro_pending_sessions') || '[]');"
echo "   pending.push(sessionData);"
echo "   localStorage.setItem('pomodoro_pending_sessions', JSON.stringify(pending));"
echo "   window.dispatchEvent(new Event('local-storage'));"
echo ""
echo "7. Click on the Stats tab again"
echo "8. Verify the session count increased by 1"
echo ""
echo "✅ If the count increased automatically without refresh, the test PASSED"
echo ""
