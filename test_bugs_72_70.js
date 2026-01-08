/**
 * Test script to verify bug fixes:
 * - Issue #72: Space key keyboard shortcut
 * - Issue #70: Dark mode toggle
 */

const { chromium } = require('playwright');

async function testBugFixes() {
  console.log('🧪 Starting bug fix verification...\n');

  const browser = await chromium.launch({
    headless: false, // Set to true for CI/CD
    slowMo: 500 // Slow down actions for visibility
  });

  const page = await browser.newPage();

  try {
    // Navigate to the app
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('✓ App loaded successfully\n');

    // TEST 1: Space key keyboard shortcut
    console.log('🎹 TEST 1: Space key keyboard shortcut');
    console.log('────────────────────────────────────');

    // Get initial button state
    const startButton = page.locator('button[aria-label="Start timer"]');
    const pauseButton = page.locator('button[aria-label="Pause timer"]');

    // Check if timer is initially stopped
    const isStartVisible = await startButton.isVisible();
    console.log(`Initial state: Timer is ${isStartVisible ? 'STOPPED' : 'RUNNING'}`);

    if (isStartVisible) {
      // Press Space to start
      console.log('Pressing Space key to start timer...');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);

      const isPauseVisibleNow = await pauseButton.isVisible();
      if (isPauseVisibleNow) {
        console.log('✓ Timer STARTED with Space key');

        // Press Space again to pause
        console.log('Pressing Space key to pause timer...');
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);

        const isStartVisibleAgain = await startButton.isVisible();
        if (isStartVisibleAgain) {
          console.log('✓ Timer PAUSED with Space key');
        } else {
          console.log('✗ Timer did NOT pause with Space key');
        }
      } else {
        console.log('✗ Timer did NOT start with Space key');
      }
    } else {
      console.log('✗ Timer was already running, test invalid');
    }

    console.log();

    // TEST 2: R key reset shortcut
    console.log('⌨️  TEST 2: R key reset shortcut');
    console.log('────────────────────────────────────');

    // Start timer first
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    // Get time display
    const timeDisplay = page.locator('p.font-mono');
    const timeAfterStart = await timeDisplay.textContent();
    console.log(`Time after starting: ${timeAfterStart}`);

    // Wait a moment
    await page.waitForTimeout(2000);

    const timeAfterWait = await timeDisplay.textContent();
    console.log(`Time after 2s: ${timeAfterWait}`);

    // Press R to reset
    console.log('Pressing R key to reset timer...');
    await page.keyboard.press('R');
    await page.waitForTimeout(500);

    const timeAfterReset = await timeDisplay.textContent();
    console.log(`Time after reset: ${timeAfterReset}`);

    // Check if reset to 25:00
    if (timeAfterReset === '25:00') {
      console.log('✓ Timer RESET with R key');
    } else {
      console.log('✗ Timer did NOT reset with R key');
    }

    console.log();

    // TEST 3: Dark mode toggle
    console.log('🌙 TEST 3: Dark mode toggle');
    console.log('────────────────────────────────────');

    // Navigate to Settings tab using direct URL with hash
    console.log('Navigating to Settings tab via URL...');
    await page.goto('http://localhost:3000#settings');
    await page.waitForTimeout(500);

    // Or try clicking on visible settings button
    try {
      // Try to find and click the desktop settings button
      const settingsButton = page.locator('button').filter({ hasText: 'Settings' }).first();
      await settingsButton.click();
      await page.waitForTimeout(500);
      console.log('✓ Settings tab opened');
    } catch (error) {
      console.log('Note: Could not click settings button, continuing anyway');
    }

    // Check current theme
    const htmlElement = page.locator('html');
    const hasDarkInitially = await htmlElement.evaluate(el => el.classList.contains('dark'));
    console.log(`Initial theme: ${hasDarkInitially ? 'DARK' : 'LIGHT'}`);

    // Click Dark mode button
    console.log('Clicking Dark mode button...');
    await page.click('button:has-text("Dark")');
    await page.waitForTimeout(500);

    const hasDarkAfterDarkClick = await htmlElement.evaluate(el => el.classList.contains('dark'));
    console.log(`After clicking Dark: ${hasDarkAfterDarkClick ? 'DARK' : 'LIGHT'}`);

    if (hasDarkAfterDarkClick) {
      console.log('✓ Dark mode ENABLED');

      // Click Light mode button
      console.log('Clicking Light mode button...');
      await page.click('button:has-text("Light")');
      await page.waitForTimeout(500);

      const hasDarkAfterLightClick = await htmlElement.evaluate(el => el.classList.contains('dark'));
      console.log(`After clicking Light: ${hasDarkAfterLightClick ? 'DARK' : 'LIGHT'}`);

      if (!hasDarkAfterLightClick) {
        console.log('✓ Light mode ENABLED');
      } else {
        console.log('✗ Light mode did NOT enable');
      }

      // Test System mode
      console.log('Clicking System mode button...');
      await page.click('button:has-text("System")');
      await page.waitForTimeout(500);

      const isSystemSelected = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('System')) {
            return btn.classList.contains('border-red-500');
          }
        }
        return false;
      });

      if (isSystemSelected) {
        console.log('✓ System mode SELECTED');
      } else {
        console.log('✗ System mode did NOT select');
      }
    } else {
      console.log('✗ Dark mode did NOT enable');
    }

    console.log();
    console.log('═'.repeat(50));
    console.log('🎉 All tests completed!');
    console.log('═'.repeat(50));

    // Take a screenshot for verification
    await page.screenshot({ path: 'screenshots/bug_fixes_verification.png', fullPage: true });
    console.log('\n📸 Screenshot saved to: screenshots/bug_fixes_verification.png');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'screenshots/bug_fixes_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testBugFixes().catch(console.error);
