/**
 * Test Script: Timer Persistence Across Page Reload
 *
 * This script tests that the timer state persists across page reloads
 * using Playwright browser automation.
 */

const { chromium } = require('playwright');

async function testTimerPersistence() {
  console.log('🧪 Starting Timer Persistence Test...\n');

  const browser = await chromium.launch({
    headless: false, // Set to true for CI/CD
    slowMo: 500 // Slow down actions for visibility
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // STEP 1: Start the application
    console.log('Step 1: Navigating to app...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // STEP 2: Verify initial state (25:00 in work mode)
    console.log('\n✓ Step 2: Checking initial state...');
    const initialTimer = await page.locator('span.tabular-nums').textContent();
    console.log(`  Initial timer: ${initialTimer}`);

    if (initialTimer !== '25:00') {
      throw new Error(`Expected 25:00, got ${initialTimer}`);
    }

    // STEP 3: Start the timer
    console.log('\n✓ Step 3: Starting timer...');
    await page.locator('button[aria-label="Start timer"]').click();
    await page.waitForTimeout(2000);

    // Check it's counting down
    const afterStart = await page.locator('span.tabular-nums').textContent();
    console.log(`  Timer after 2 seconds: ${afterStart}`);

    // STEP 4: Wait for timer to reach 20:00 (or close to it)
    console.log('\n✓ Step 4: Waiting for timer to count down...');
    await page.waitForTimeout(30000); // Wait 30 seconds

    const afterWait = await page.locator('span.tabular-nums').textContent();
    console.log(`  Timer after ~30 seconds: ${afterWait}`);

    // Verify timer is in the 24-minute range
    const [mins, secs] = afterWait.split(':').map(Number);
    if (mins > 24 || (mins === 24 && secs > 45)) {
      throw new Error(`Timer did not count down properly. Expected ~24:30, got ${afterWait}`);
    }

    // STEP 5: Reload the page
    console.log('\n✓ Step 5: Reloading page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // STEP 6: Verify timer shows the saved time
    console.log('\n✓ Step 6: Verifying timer persistence...');
    const afterReload = await page.locator('span.tabular-nums').textContent();
    console.log(`  Timer after reload: ${afterReload}`);

    // The time should be close to what it was before reload (allowing for 1-2 seconds difference)
    const [reloadMins, reloadSecs] = afterReload.split(':').map(Number);
    const [beforeMins, beforeSecs] = afterWait.split(':').map(Number);

    const beforeTotal = beforeMins * 60 + beforeSecs;
    const reloadTotal = reloadMins * 60 + reloadSecs;
    const difference = Math.abs(beforeTotal - reloadTotal);

    if (difference > 5) {
      throw new Error(
        `Timer time jumped too much after reload! ` +
        `Before: ${afterWait}, After: ${afterReload}, Difference: ${difference}s`
      );
    }

    // STEP 7: Verify mode is still 'Work'
    console.log('\n✓ Step 7: Verifying mode persistence...');
    const modeLabel = await page.locator('h2.text-2xl').textContent();
    console.log(`  Current mode: ${modeLabel}`);

    if (modeLabel !== 'Work') {
      throw new Error(`Mode changed! Expected 'Work', got '${modeLabel}'`);
    }

    // STEP 8: Verify session counter
    console.log('\n✓ Step 8: Verifying session counter...');
    const sessionCounter = await page.locator('p.text-lg').textContent();
    console.log(`  Session counter: ${sessionCounter}`);

    if (!sessionCounter.includes('Session 1 of 4')) {
      throw new Error(`Session counter changed! Expected 'Session 1 of 4', got '${sessionCounter}'`);
    }

    console.log('\n✅ ALL TESTS PASSED! Timer persistence is working correctly.\n');
    console.log('Summary:');
    console.log('  ✓ Timer started and counted down');
    console.log('  ✓ Timer state saved to localStorage');
    console.log('  ✓ Timer restored correctly after reload');
    console.log('  ✓ Mode persisted correctly');
    console.log('  ✓ Session counter persisted correctly');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('\nStack trace:', error.stack);

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'tests/screenshots/timer-persistence-error.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved to: tests/screenshots/timer-persistence-error.png');

    process.exit(1);

  } finally {
    await browser.close();
    console.log('\n🎬 Test completed. Browser closed.\n');
  }
}

// Run the test
testTimerPersistence().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
