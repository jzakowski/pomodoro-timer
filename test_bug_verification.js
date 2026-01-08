const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🧪 Bug Verification Test');
  console.log('========================\n');

  // Test 1: Space key bug
  console.log('Test 1: Space key should start/pause timer');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const initialTime = await page.textContent('[data-testid="timer-display"]');
  console.log(`Initial time: ${initialTime}`);

  // Press Space to start
  await page.keyboard.press('Space');
  await page.waitForTimeout(1500);

  const afterStartTime = await page.textContent('[data-testid="timer-display"]');
  console.log(`After Space press: ${afterStartTime}`);

  if (initialTime !== afterStartTime) {
    console.log('✅ PASS: Space key starts timer');
  } else {
    console.log('❌ FAIL: Space key does NOT start timer');
  }

  // Press Space again to pause
  await page.keyboard.press('Space');
  const pausedTime = await page.textContent('[data-testid="timer-display"]');
  await page.waitForTimeout(1500);
  const stillPausedTime = await page.textContent('[data-testid="timer-display"]');

  console.log(`Paused at: ${pausedTime}`);
  console.log(`After 1.5s: ${stillPausedTime}`);

  if (pausedTime === stillPausedTime) {
    console.log('✅ PASS: Space key pauses timer');
  } else {
    console.log('❌ FAIL: Space key does NOT pause timer');
  }

  // Test 2: Dark mode toggle
  console.log('\nTest 2: Dark mode toggle');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const bodyBefore = await page.evaluate(() => {
    const body = document.body;
    return {
      classList: body.className,
      backgroundColor: window.getComputedStyle(body).backgroundColor,
      color: window.getComputedStyle(body).color
    };
  });

  console.log('Before dark mode toggle:');
  console.log(`  Classes: ${bodyBefore.classList}`);
  console.log(`  BG Color: ${bodyBefore.backgroundColor}`);
  console.log(`  Text Color: ${bodyBefore.color}`);

  // Find and click theme toggle
  const themeToggle = await page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="mode"]').first();
  const toggleExists = await themeToggle.count() > 0;

  if (toggleExists) {
    await themeToggle.click();
    await page.waitForTimeout(500);

    const bodyAfter = await page.evaluate(() => {
      const body = document.body;
      return {
        classList: body.className,
        backgroundColor: window.getComputedStyle(body).backgroundColor,
        color: window.getComputedStyle(body).color
      };
    });

    console.log('\nAfter dark mode toggle:');
    console.log(`  Classes: ${bodyAfter.classList}`);
    console.log(`  BG Color: ${bodyAfter.backgroundColor}`);
    console.log(`  Text Color: ${bodyAfter.color}`);

    if (bodyBefore.backgroundColor !== bodyAfter.backgroundColor ||
        bodyBefore.classList !== bodyAfter.classList) {
      console.log('✅ PASS: Dark mode toggle works');
    } else {
      console.log('❌ FAIL: Dark mode toggle does NOT work');
    }
  } else {
    console.log('⚠️  WARNING: Could not find theme toggle button');
  }

  await browser.close();
  console.log('\n✨ Tests complete');
})();
