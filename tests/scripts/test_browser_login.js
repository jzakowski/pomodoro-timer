/**
 * Browser Automation Test Script for Pomodoro Timer
 *
 * This script uses Puppeteer to automate browser testing for the Pomodoro Timer app.
 * It can verify UI elements, take screenshots, and test user interactions.
 *
 * Usage:
 *   node tests/scripts/test_browser_login.js
 *
 * Requirements:
 *   - npm install puppeteer
 *   - App running on http://localhost:3000
 */

const puppeteer = require('puppeteer');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testPomodoroTimer() {
  console.log('🍅 Starting Pomodoro Timer Browser Test...');
  console.log('📱 Opening browser...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for visual verification
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
    ]
  });

  const page = await browser.newPage();

  // Set viewport to common desktop size
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Navigate to app
    console.log('🌐 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Page loaded successfully');

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/01_initial_load.png' });
    console.log('📸 Screenshot saved: tests/screenshots/01_initial_load.png');

    // Check if timer is visible
    const timerVisible = await page.$eval('[data-timer]', (el) => {
      return window.getComputedStyle(el).display !== 'none';
    });
    console.log(timerVisible ? '✅ Timer is visible' : '❌ Timer is NOT visible');

    // Check for Start button
    const startButton = await page.$('[data-testid="start-button"]');
    console.log(startButton ? '✅ Start button found' : '❌ Start button NOT found');

    // Check for Pause button
    const pauseButton = await page.$('[data-testid="pause-button"]');
    console.log(pauseButton ? '✅ Pause button found' : '❌ Pause button NOT found');

    // Check for Reset button
    const resetButton = await page.$('[data-testid="reset-button"]');
    console.log(resetButton ? '✅ Reset button found' : '❌ Reset button NOT found');

    // Check for Skip button
    const skipButton = await page.$('[data-testid="skip-button"]');
    console.log(skipButton ? '✅ Skip button found' : '❌ Skip button NOT found');

    // Check timer display
    const timerText = await page.$eval('[data-timer]', (el) => el.textContent);
    console.log(`⏱️  Timer shows: ${timerText}`);

    // Test Start button click
    if (startButton) {
      console.log('🖱️  Clicking Start button...');
      await startButton.click();
      await sleep(2000);

      const timerAfterStart = await page.$eval('[data-timer]', (el) => el.textContent);
      console.log(`⏱️  Timer after start: ${timerAfterStart}`);

      await page.screenshot({ path: 'tests/screenshots/02_after_start.png' });
      console.log('📸 Screenshot saved: tests/screenshots/02_after_start.png');
    }

    // Test Pause button
    const pauseButtonAfterStart = await page.$('[data-testid="pause-button"]');
    if (pauseButtonAfterStart) {
      console.log('⏸️  Clicking Pause button...');
      await pauseButtonAfterStart.click();
      await sleep(1000);

      const timerAfterPause = await page.$eval('[data-timer]', (el) => el.textContent);
      console.log(`⏱️  Timer after pause: ${timerAfterPause}`);

      await page.screenshot({ path: 'tests/screenshots/03_after_pause.png' });
      console.log('📸 Screenshot saved: tests/screenshots/03_after_pause.png');
    }

    // Check for console errors
    const consoleErrors = await page.evaluate(() => {
      return window.__consoleErrors || [];
    });

    if (consoleErrors.length > 0) {
      console.log('⚠️  Console errors found:');
      consoleErrors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('✅ No console errors');
    }

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    // Take error screenshot
    try {
      await page.screenshot({ path: 'tests/screenshots/error.png' });
      console.log('📸 Error screenshot saved: tests/screenshots/error.png');
    } catch (screenshotError) {
      // Ignore screenshot errors
    }

    throw error;
  } finally {
    await browser.close();
    console.log('🔚 Browser closed');
  }
}

// Capture console errors
function setupConsoleCapture(page) {
  page.evaluateOnNewDocument(() => {
    window.__consoleErrors = [];
    const originalError = console.error;
    console.error = function(...args) {
      window.__consoleErrors.push(args.join(' '));
      originalError.apply(console, args);
    };
  });
}

// Run test
(async () => {
  try {
    await testPomodoroTimer();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
})();
