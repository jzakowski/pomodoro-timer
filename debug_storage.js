const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Start timer
  await page.locator('button[aria-label="Start timer"]').click();
  await page.waitForTimeout(5000);

  // Check localStorage
  const storage = await page.evaluate(() => {
    return {
      pomodoro_timer_state: localStorage.getItem('pomodoro_timer_state')
    };
  });

  console.log('LocalStorage contents:', JSON.stringify(storage, null, 2));

  await page.waitForTimeout(2000);
  await browser.close();
})();
