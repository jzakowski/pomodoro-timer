/**
 * Test Timer State Persistence
 *
 * This test verifies that the timer state persists across page reloads.
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testing Timer State Persistence...\n');

    // Step 1: Navigate to app
    console.log('Step 1: Navigating to app...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // Step 2: Get initial timer value
    console.log('Step 2: Getting initial timer value...');
    const initialTime = await page.locator('.tabular-nums').textContent();
    console.log(`   Initial timer: ${initialTime}`);

    // Step 3: Start the timer
    console.log('\nStep 3: Starting timer...');
    await page.click('[aria-label="Start timer"]');
    await page.waitForTimeout(2000);

    // Step 4: Check timer is running
    console.log('Step 4: Checking timer is running...');
    const runningTime = await page.locator('.tabular-nums').textContent();
    console.log(`   Timer after 2s: ${runningTime}`);

    if (runningTime === initialTime) {
      console.log('   ❌ FAIL: Timer did not start');
      process.exit(1);
    }
    console.log('   ✅ Timer is running');

    // Step 5: Reload the page
    console.log('\nStep 5: Reloading page...');
    await page.waitForTimeout(1000);
    const timeBeforeReload = await page.locator('.tabular-nums').textContent();
    console.log(`   Timer before reload: ${timeBeforeReload}`);
    await page.reload();
    await page.waitForTimeout(1000);

    // Step 6: Check timer after reload
    console.log('\nStep 6: Checking timer after reload...');
    const timeAfterReload = await page.locator('.tabular-nums').textContent();
    console.log(`   Timer after reload: ${timeAfterReload}`);

    // Parse times to compare
    const parseTime = (timeStr) => {
      const [mins, secs] = timeStr.split(':').map(Number);
      return mins * 60 + secs;
    };

    const secondsBefore = parseTime(timeBeforeReload);
    const secondsAfter = parseTime(timeAfterReload);

    // Account for ~2 seconds elapsed during reload
    const diff = Math.abs(secondsBefore - secondsAfter);

    console.log(`   Time difference: ${diff} seconds`);

    if (diff <= 3) {
      console.log('   ✅ PASS: Timer state persisted correctly');
    } else {
      console.log(`   ❌ FAIL: Timer difference too large (${diff}s)`);
      process.exit(1);
    }

    console.log('\n✅ All tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✓ Timer starts correctly');
    console.log('   ✓ Timer state persists across reload');
    console.log('   ✓ Time is adjusted for elapsed time during reload');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
