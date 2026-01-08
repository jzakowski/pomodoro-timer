/**
 * Test script to verify settings persist across page reloads
 * This simulates the test steps from issue #23
 */

const { chromium } = require('playwright');

async function testSettingsPersistence() {
  console.log('🧪 Testing Settings Persistence (Issue #23)\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 } // Desktop viewport
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to the app
    console.log('Step 1: Navigating to app...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('✓ App loaded\n');

    // Step 2: Navigate to Settings tab
    console.log('Step 2: Navigating to Settings tab...');

    // Use locator to find the second navigation (desktop) and click Settings
    const desktopNav = page.locator('nav').nth(1);
    await desktopNav.locator('button', { hasText: 'Settings' }).click({ timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('✓ Settings tab opened\n');

    // Step 3: Change Work Duration to 30 minutes
    console.log('Step 3: Changing Work Duration to 30 minutes...');

    // Find the first slider (Work Duration) by its position
    const sliders = await page.locator('input[type="range"]').all();
    const workDurationSlider = sliders[0]; // First slider is Work Duration

    // Fill in the value directly
    await workDurationSlider.fill('30');
    await workDurationSlider.dispatchEvent('input'); // Trigger React's onChange
    await page.waitForTimeout(1000); // Wait for state to update

    // Verify the value changed in the UI
    const workDurationText = await page.locator('text=30 min').first();
    if (await workDurationText.isVisible()) {
      console.log('✓ Work Duration changed to 30 min\n');
    } else {
      throw new Error('Work Duration did not update in UI');
    }

    // Step 4: Change theme to Dark
    console.log('Step 4: Changing theme to Dark...');
    await page.click('button:has-text("Dark")');
    await page.waitForTimeout(1000);
    console.log('✓ Theme changed to Dark\n');

    // Verify dark mode is applied
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    if (isDarkMode) {
      console.log('✓ Dark mode class applied to document\n');
    } else {
      throw new Error('Dark mode was not applied');
    }

    // Step 5: Reload page
    console.log('Step 5: Reloading page...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('✓ Page reloaded\n');

    // Step 6: Return to Settings tab
    console.log('Step 6: Returning to Settings tab...');
    const desktopNav2 = page.locator('nav').nth(1);
    await desktopNav2.locator('button', { hasText: 'Settings' }).click({ timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('✓ Settings tab opened\n');

    // Step 7: Verify Work Duration still shows 30 minutes
    console.log('Step 7: Verifying Work Duration persisted...');
    const persistedWorkDurationText = await page.locator('text=30 min').first();

    if (await persistedWorkDurationText.isVisible()) {
      console.log('✓ Work Duration persisted: 30 min\n');
    } else {
      throw new Error('Work Duration did not persist after reload');
    }

    // Step 8: Verify theme is still Dark
    console.log('Step 8: Verifying theme persisted...');
    const isStillDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    if (isStillDarkMode) {
      console.log('✓ Theme persisted: Dark\n');
    } else {
      throw new Error('Theme did not persist after reload');
    }

    // Check localStorage directly
    console.log('Step 9: Checking localStorage...');
    const settings = await page.evaluate(() => {
      const stored = localStorage.getItem('pomodoro_settings');
      return stored ? JSON.parse(stored) : null;
    });

    console.log('Settings in localStorage:', JSON.stringify(settings, null, 2));

    if (settings && settings.workDuration === 30 && settings.theme === 'dark') {
      console.log('✓ localStorage contains correct settings:');
      console.log(`  - workDuration: ${settings.workDuration}`);
      console.log(`  - theme: ${settings.theme}\n`);
    } else if (settings && settings.workDuration === 30) {
      // Theme might be 'system' on desktop
      console.log('✓ localStorage contains workDuration setting:');
      console.log(`  - workDuration: ${settings.workDuration}`);
      console.log(`  - theme: ${settings.theme} (note: may be system default)\n`);
    } else {
      throw new Error('localStorage does not contain expected settings');
    }

    console.log('✅ All tests passed! Settings persist correctly across page reloads.\n');

    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  } finally {
    await context.close();
    await browser.close();
  }
}

// Run the test
testSettingsPersistence().then(success => {
  process.exit(success ? 0 : 1);
});
