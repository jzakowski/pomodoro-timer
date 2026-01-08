/**
 * Mobile Layout Responsiveness Test
 * Tests mobile layout responsiveness across all tabs
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testMobileLayout() {
  console.log('📱 Testing Mobile Layout Responsiveness...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone 12 dimensions
  });
  const page = await context.newPage();

  try {
    // Ensure screenshots directory exists
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    // 1. Load app
    console.log('1. Loading app on mobile viewport (375x812)...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    console.log('✓ App loaded\n');

    // 2. Test Timer Tab
    console.log('2. Testing Timer tab...');
    await page.screenshot({ path: 'screenshots/mobile_timer_tab.png' });
    console.log('📸 Screenshot saved: screenshots/mobile_timer_tab.png');

    // Check timer visibility
    const timerText = await page.locator('text=25:00').isVisible();
    console.log(`  Timer visible: ${timerText ? '✓' : '✗'}`);

    // Check button visibility
    const buttons = await page.locator('button').count();
    console.log(`  Buttons visible: ${buttons}`);

    // Check for horizontal scroll (bad)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.viewportSize().width;
    const hasHorizontalScroll = bodyWidth > viewportWidth;
    console.log(`  Horizontal scroll: ${hasHorizontalScroll ? '✗ BAD' : '✓ GOOD'}`);

    // Check timer text size
    const timerFontSize = await page.locator('p:has-text("25:00")').evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    console.log(`  Timer font size: ${timerFontSize}`);
    console.log('');

    // 3. Test Tasks Tab
    console.log('3. Testing Tasks tab...');
    await page.click('button[aria-label="Tasks"]', { force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/mobile_tasks_tab.png' });
    console.log('📸 Screenshot saved: screenshots/mobile_tasks_tab.png');

    // Check for horizontal scroll
    const tasksBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const tasksHasScroll = tasksBodyWidth > viewportWidth;
    console.log(`  Horizontal scroll: ${tasksHasScroll ? '✗ BAD' : '✓ GOOD'}`);
    console.log('');

    // 4. Test Stats Tab
    console.log('4. Testing Stats tab...');
    await page.click('button[aria-label="Stats"]', { force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/mobile_stats_tab.png' });
    console.log('📸 Screenshot saved: screenshots/mobile_stats_tab.png');

    // Check stats cards layout
    const statsCards = await page.locator('div[class*="grid grid-cols-2"]').isVisible();
    console.log(`  Stats grid visible: ${statsCards ? '✓' : '✗'}`);

    // Check for horizontal scroll
    const statsBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const statsHasScroll = statsBodyWidth > viewportWidth;
    console.log(`  Horizontal scroll: ${statsHasScroll ? '✗ BAD' : '✓ GOOD'}`);
    console.log('');

    // 5. Test Settings Tab
    console.log('5. Testing Settings tab...');
    await page.click('button[aria-label="Settings"]', { force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/mobile_settings_tab.png' });
    console.log('📸 Screenshot saved: screenshots/mobile_settings_tab.png');

    // Check for horizontal scroll
    const settingsBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const settingsHasScroll = settingsBodyWidth > viewportWidth;
    console.log(`  Horizontal scroll: ${settingsHasScroll ? '✗ BAD' : '✓ GOOD'}`);
    console.log('');

    // 6. Test different mobile sizes
    console.log('6. Testing different mobile screen sizes...');

    const mobileSizes = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
      { name: 'Android Small', width: 360, height: 640 },
    ];

    for (const size of mobileSizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(300);
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const hasScroll = bodyWidth > size.width;
      console.log(`  ${size.name} (${size.width}x${size.height}): ${hasScroll ? '✗ SCROLL' : '✓ OK'}`);
    }

    console.log('\n✅ Mobile layout test completed!');
    console.log('\nCheck screenshots in the screenshots/ directory');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testMobileLayout().catch(console.error);
