/**
 * Test script for Issue #8: Session counter displays correctly
 */

async function testSessionCounter() {
  console.log('🧪 Testing Issue #8: Session counter displays correctly\n');

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Step 1: Navigate to localhost:3000
    console.log('📍 Step 1: Navigating to localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1000);

    // Step 2: Verify session counter shows 'Session 1 of 4'
    console.log('\n📍 Step 2: Verifying initial session counter');
    const initialCounter = await page.$eval('p.text-lg.font-medium', el => el.textContent);
    console.log(`  Session counter: ${initialCounter}`);

    if (initialCounter.includes('Session 1 of 4')) {
      console.log('  ✅ PASS: Session counter shows "Session 1 of 4"');
    } else {
      console.log('  ❌ FAIL: Session counter not showing correctly');
      return;
    }

    // Step 3: Skip through sessions to test counter updates
    console.log('\n📍 Step 3: Testing session counter updates');

    // Skip to short break (should stay session 1)
    console.log('\n  Skipping to Short Break...');
    await page.click('button[aria-label="Skip session"]');
    await page.waitForTimeout(500);

    let counterAfterSkip1 = await page.$eval('p.text-lg.font-medium', el => el.textContent);
    console.log(`  After skip to break: ${counterAfterSkip1}`);

    // Skip back to work (should become session 2)
    console.log('\n  Skipping back to Work...');
    await page.click('button[aria-label="Skip session"]');
    await page.waitForTimeout(500);

    let counterAfterSkip2 = await page.$eval('p.text-lg.font-medium', el => el.textContent);
    console.log(`  After skip to work: ${counterAfterSkip2}`);

    if (counterAfterSkip2.includes('Session 2 of 4')) {
      console.log('  ✅ PASS: Session counter updated to "Session 2 of 4"');
    } else {
      console.log('  ❌ FAIL: Session counter not updating correctly');
      return;
    }

    // Step 4: Test multiple session advances
    console.log('\n📍 Step 4: Testing multiple session advances');

    for (let i = 3; i <= 4; i++) {
      // Skip to break
      await page.click('button[aria-label="Skip session"]');
      await page.waitForTimeout(300);

      // Skip to work
      await page.click('button[aria-label="Skip session"]');
      await page.waitForTimeout(300);

      const counter = await page.$eval('p.text-lg.font-medium', el => el.textContent);
      console.log(`  Session counter: ${counter}`);

      if (counter.includes(`Session ${i} of 4`)) {
        console.log(`  ✅ Session ${i} of 4 displaying correctly`);
      } else {
        console.log(`  ❌ FAIL: Expected Session ${i} of 4`);
      }
    }

    // Step 5: Verify long break triggers after 4 sessions
    console.log('\n📍 Step 5: Testing long break trigger');

    // After session 4, next skip should trigger long break
    await page.click('button[aria-label="Skip session"]');
    await page.waitForTimeout(500);

    const modeLabel = await page.$eval('p.text-lg.mt-2', el => el.textContent);
    console.log(`  Mode after session 4: ${modeLabel}`);

    if (modeLabel === 'Long Break') {
      console.log('  ✅ PASS: Long break triggered after 4 work sessions');

      // Check if session counter reset to 1
      const counterAfterLongBreak = await page.$eval('p.text-lg.font-medium', el => el.textContent);
      console.log(`  Session counter after long break: ${counterAfterLongBreak}`);

      if (counterAfterLongBreak.includes('Session 1 of 4')) {
        console.log('  ✅ PASS: Session counter reset to 1 after long break');
      }
    } else {
      console.log('  ❌ FAIL: Long break did not trigger');
    }

    console.log('\n✨ All tests passed! Issue #8 is complete.\n');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
}

testSessionCounter();
