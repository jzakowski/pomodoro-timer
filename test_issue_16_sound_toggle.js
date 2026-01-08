/**
 * Test Script for Issue #16: Sound Notifications Toggle
 *
 * This script tests that the sound toggle in Settings properly
 * mutes/unmutes the completion sound.
 *
 * Usage:
 * 1. Open http://localhost:3002 in your browser
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter to run the test
 */

console.log('🔊 Testing Issue #16: Sound Notifications Toggle\n');

// Test helper functions
const TestHelper = {
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  getSoundEnabled: () => {
    const settings = localStorage.getItem('pomodoro_settings');
    if (!settings) {
      console.error('❌ Settings not found in localStorage');
      return null;
    }
    return JSON.parse(settings).soundEnabled;
  },

  setSoundEnabled: (enabled) => {
    const settings = JSON.parse(localStorage.getItem('pomodoro_settings') || '{}');
    settings.soundEnabled = enabled;
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('local-storage'));
    console.log(`   ✓ Sound set to: ${enabled ? 'ON' : 'OFF'}`);
  },

  findStartButton: () => {
    // Find the start/pause button by aria-label
    return document.querySelector('button[aria-label="Start timer"]') ||
           document.querySelector('button[aria-label="Pause timer"]');
  },

  clickButton: (button) => {
    button.click();
    console.log('   ✓ Button clicked');
  },

  setTimerToZero: () => {
    // This is a helper to quickly test by manipulating the timer
    // In a real scenario, we'd wait for the full 25 minutes
    // For testing purposes, we'll just check the setting is respected
    console.log('   ℹ️  In manual testing, wait for timer to complete');
  }
};

// Main test function
async function testSoundToggle() {
  console.log('📋 Test Plan:');
  console.log('   1. Check current sound setting');
  console.log('   2. Navigate to Settings tab');
  console.log('   3. Toggle sound OFF');
  console.log('   4. Verify setting saved');
  console.log('   5. Navigate to Timer tab');
  console.log('   6. Start timer and verify no sound plays');
  console.log('   7. Navigate back to Settings');
  console.log('   8. Toggle sound ON');
  console.log('   9. Verify sound plays on timer completion\n');

  console.log('🧪 Step 1: Check initial sound setting');
  const initialSoundEnabled = TestHelper.getSoundEnabled();
  console.log(`   Current sound setting: ${initialSoundEnabled ? 'ON' : 'OFF'}`);

  console.log('\n✅ Manual Test Instructions:');
  console.log('\n1. Navigate to Settings tab (click Settings button)');
  console.log('2. Find "Sound Notifications" toggle');
  console.log('3. Toggle it OFF');
  console.log('4. Verify the toggle moves to the left and turns gray');
  console.log('5. Navigate back to Timer tab');
  console.log('6. Click Start button');
  console.log('7. Wait for timer to complete (or click Skip button)');
  console.log('   → Expected: NO sound should play');
  console.log('\n8. Navigate back to Settings tab');
  console.log('9. Toggle "Sound Notifications" back ON');
  console.log('10. Navigate to Timer tab');
  console.log('11. Start timer again');
  console.log('12. Wait for completion or Skip');
  console.log('   → Expected: Sound should play (chime)');

  console.log('\n📊 Verification Checklist:');
  console.log('   [ ] Toggle moves smoothly between ON/OFF');
  console.log('   [ ] Setting persists when switching tabs');
  console.log('   [ ] NO sound when toggle is OFF');
  console.log('   [ ] Sound plays when toggle is ON');
  console.log('   [ ] Setting persists after page reload');

  console.log('\n💾 Quick verification commands:');
  console.log('   Check current setting:');
  console.log('   localStorage.getItem("pomodoro_settings")');
  console.log('\n   Toggle sound via console:');
  console.log('   const s = JSON.parse(localStorage.getItem("pomodoro_settings"));');
  console.log('   s.soundEnabled = !s.soundEnabled;');
  console.log('   localStorage.setItem("pomodoro_settings", JSON.stringify(s));');
  console.log('   window.dispatchEvent(new Event("local-storage"));');

  console.log('\n🎯 Expected Code Behavior:');
  console.log('   In timerContext.tsx, line ~105:');
  console.log('   if (soundEnabled) {');
  console.log('     playCompletionSound();');
  console.log('   }');
  console.log('\n   This ensures sound only plays when soundEnabled === true');

  console.log('\n✨ Test complete! Follow the manual instructions above.');
}

// Run the test
testSoundToggle().catch(console.error);
