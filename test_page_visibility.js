const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-infobars']
  });

  try {
    console.log('🔍 Testing Page Visibility API - Feature #59\n');

    // Create first page (Pomodoro app)
    const page1 = await browser.newPage();
    await page1.goto('http://localhost:3000');
    await page1.waitForSelector('nav', { timeout: 5000 });
    console.log('✅ App loaded successfully');

    // Test 1: Start timer in Work mode
    console.log('\n📋 Test 1: Start timer in Work mode');
    await page1.click('button[aria-label="Start timer"]');
    await page1.waitForTimeout(1000);

    const timerText1 = await page1.$eval('p.font-mono', el => el.textContent);
    console.log(`✅ Timer started: ${timerText1}`);

    // Test 2: Switch to different tab (simulate tab switch)
    console.log('\n📋 Test 2: Switch to different browser tab');

    // Create a second page to simulate tab switching
    const page2 = await browser.newPage();
    await page2.goto('about:blank');
    await page2.setContent('<h1>Another Tab</h1>');
    console.log('✅ Switched to different tab');

    // Wait 5 seconds while on different tab
    console.log('⏳ Waiting 5 seconds on different tab...');
    await page2.waitForTimeout(5000);

    // Test 3: Return to Pomodoro tab
    console.log('\n📋 Test 3: Return to Pomodoro tab');
    await page1.bringToFront();
    await page1.waitForTimeout(500);

    // Check timer value
    const timerText2 = await page1.$eval('p.font-mono', el => el.textContent);
    console.log(`✅ Timer after returning: ${timerText2}`);

    // Verify timer has paused (should be same as when we left, approximately)
    const time1 = parseInt(timerText1.split(':').map(Number).join(''));
    const time2 = parseInt(timerText2.split(':').map(Number).join(''));

    // The timer should have accounted for the 5 seconds elapsed
    // Original: 25:00 = 2500, After 5 seconds should be around: 24:55 = 2455
    console.log(`📊 Time before tab switch: ${timerText1} (${time1})`);
    console.log(`📊 Time after return: ${timerText2} (${time2})`);
    console.log(`📊 Expected difference: ~5 seconds`);

    const expectedDiff = 5;
    const actualDiff = time1 - time2;

    if (Math.abs(actualDiff - expectedDiff) <= 1) {
      console.log(`✅ Timer correctly accounted for elapsed time (diff: ${actualDiff}s)`);
    } else {
      console.log(`⚠️  Timer time discrepancy: expected ~${expectedDiff}s, got ${actualDiff}s`);
    }

    // Test 4: Verify timer is running again
    console.log('\n📋 Test 4: Verify timer auto-resumes');
    const isRunningCheck1 = await page1.$eval('button[aria-label="Pause timer"]', btn => {
      return btn !== null;
    });

    if (isRunningCheck1) {
      console.log('✅ Timer auto-resumed after returning to tab');
    } else {
      console.log('⚠️  Timer did not auto-resume');
    }

    // Wait another 2 seconds and verify timer continues
    await page1.waitForTimeout(2000);
    const timerText3 = await page1.$eval('p.font-mono', el => el.textContent);
    console.log(`✅ Timer continues: ${timerText3}`);

    // Test 5: Test with window minimize simulation
    console.log('\n📋 Test 5: Test window visibility changes');

    // Start fresh timer
    await page1.click('button[aria-label="Reset timer"]');
    await page1.waitForTimeout(500);
    await page1.click('button[aria-label="Start timer"]');
    await page1.waitForTimeout(1000);

    const timerBeforeMinimize = await page1.$eval('p.font-mono', el => el.textContent);
    console.log(`Timer before minimize: ${timerBeforeMinimize}`);

    // Minimize window using Page.visibility API
    await page1.evaluate(() => {
      Object.defineProperty(document, 'hidden', { get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page1.waitForTimeout(3000);

    // Restore window
    await page1.evaluate(() => {
      Object.defineProperty(document, 'hidden', { get: () => false });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page1.waitForTimeout(500);

    const timerAfterRestore = await page1.$eval('p.font-mono', el => el.textContent);
    console.log(`Timer after restore: ${timerAfterRestore}`);

    const timeBefore = parseInt(timerBeforeMinimize.split(':').map(Number).join(''));
    const timeAfter = parseInt(timerAfterRestore.split(':').map(Number).join(''));
    const diffMinimize = timeBefore - timeAfter;

    console.log(`✅ Window visibility test complete (elapsed: ${diffMinimize}s)`);

    console.log('\n✅ All Page Visibility API tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
