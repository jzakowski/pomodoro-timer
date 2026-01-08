const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-logging']  // Enable browser console logging
  });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });

  // First visit - start timer
  console.log('=== First visit - starting timer ===');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  await page.locator('button[aria-label="Start timer"]').click();
  await page.waitForTimeout(5000);

  const timer1 = await page.locator('span.tabular-nums').textContent();
  console.log('\nTimer before reload:', timer1);

  // Reload
  console.log('\n=== Reloading page ===\n');
  await page.reload();
  await page.waitForTimeout(3000);

  const timer2 = await page.locator('span.tabular-nums').textContent();
  console.log('\nTimer after reload:', timer2);

  // Check localStorage
  const storage = await page.evaluate(() => {
    const state = localStorage.getItem('pomodoro_timer_state');
    return { state };
  });

  console.log('\nLocalStorage from page:', storage.state);

  await browser.close();
})();
