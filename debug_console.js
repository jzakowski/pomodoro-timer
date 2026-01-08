const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all console messages
  page.on('console', msg => {
    console.log('🔍 [BROWSER]', msg.text());
  });

  console.log('=== Test 1: First load ===');
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(3000);

  console.log('\n=== Test 2: Start timer ===');
  await page.locator('button[aria-label="Start timer"]').click();
  await page.waitForTimeout(3000);

  console.log('\n=== Test 3: Reload ===');
  await page.reload();
  await page.waitForTimeout(3000);

  console.log('\n=== Test 4: Check final state ===');
  const timer = await page.locator('span.tabular-nums').textContent();
  const storage = await page.evaluate(() => localStorage.getItem('pomodoro_timer_state'));
  console.log('Final timer:', timer);
  console.log('Final storage:', storage);

  await browser.close();
})();
