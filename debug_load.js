const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // First visit - start timer
  console.log('First visit - starting timer...');
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);
  await page.locator('button[aria-label="Start timer"]').click();
  await page.waitForTimeout(5000);

  const timer1 = await page.locator('span.tabular-nums').textContent();
  console.log('Timer before reload:', timer1);

  // Reload
  console.log('\nReloading page...');
  await page.reload();
  await page.waitForTimeout(2000);

  const timer2 = await page.locator('span.tabular-nums').textContent();
  console.log('Timer after reload:', timer2);

  // Check localStorage
  const storage = await page.evaluate(() => {
    const state = localStorage.getItem('pomodoro_timer_state');
    console.log('In-browser localStorage:', state);
    return { state };
  });

  console.log('\nLocalStorage from page:', storage.state);

  await browser.close();
})();
