const puppeteer = require('puppeteer');

async function testPageVisibility() {
  console.log('🔍 Testing Page Visibility API - Feature #59\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-infobars']
  });

  try {
    // Create main page
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav', { timeout: 5000 });
    console.log('✅ App loaded');

    // Test 1: Start timer
    console.log('\n📋 Test 1: Start timer');
    await page.click('button[aria-label="Start timer"]');
    await page.waitForTimeout(1000);
    const timer1 = await page.$eval('p.font-mono', el => el.textContent);
    console.log(`✅ Timer: ${timer1}`);

    // Test 2: Simulate page hide (tab switch)
    console.log('\n📋 Test 2: Simulate tab switch (hide page)');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(5000);
    console.log('⏳ Waited 5 seconds while hidden');

    // Test 3: Show page again
    console.log('\n📋 Test 3: Return to tab (show page)');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { get: () => false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(500);

    const timer2 = await page.$eval('p.font-mono', el => el.textContent);
    console.log(`✅ Timer after return: ${timer2}`);

    // Parse times to compare
    const [min1, sec1] = timer1.split(':').map(Number);
    const [min2, sec2] = timer2.split(':').map(Number);
    const total1 = min1 * 60 + sec1;
    const total2 = min2 * 60 + sec2;
    const elapsed = total1 - total2;

    console.log(`\n📊 Results:`);
    console.log(`   Before: ${timer1} (${total1}s)`);
    console.log(`   After:  ${timer2} (${total2}s)`);
    console.log(`   Elapsed: ${elapsed}s (expected: ~5s)`);

    if (Math.abs(elapsed - 5) <= 1) {
      console.log('\n✅ SUCCESS: Timer correctly accounted for hidden time!');
    } else {
      console.log('\n⚠️  WARNING: Time discrepancy detected');
    }

    // Test 4: Verify timer resumed
    const pauseBtn = await page.$('button[aria-label="Pause timer"]');
    if (pauseBtn) {
      console.log('✅ Timer auto-resumed after tab return');
    } else {
      console.log('⚠️  Timer may not have resumed');
    }

    console.log('\n✅ Test complete!\n');
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testPageVisibility().catch(console.error);
