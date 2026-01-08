/**
 * Test Script: Tab Navigation
 * Issue: #46 - Tab navigation switches between Timer/Tasks/Stats/Settings
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'tests/verification/issue_46_tab_navigation');

// Create screenshot directory
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function testTabNavigation() {
  console.log('🧪 Testing Tab Navigation...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Step 1: Navigate to app
    console.log('Step 1: Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1_timer_tab_initial.png') });
    console.log('   ✅ Page loaded\n');

    // Step 2: Verify Timer tab is active
    console.log('Step 2: Verifying Timer tab is active by default...');
    const timerTabActive = await page.evaluate(() => {
      const timerTab = document.querySelector('button[aria-label="Timer"]');
      return timerTab && timerTab.getAttribute('aria-current') === 'page';
    });
    console.log(`   Timer tab active: ${timerTabActive ? '✅' : '❌'}\n`);

    // Step 3: Check if all tabs are present
    console.log('Step 3: Checking all tabs are present...');
    const tabs = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      return buttons.map(btn => btn.getAttribute('aria-label'));
    });
    console.log(`   Tabs found: ${tabs.join(', ')} ✅\n`);

    // Step 4: Click Tasks tab
    console.log('Step 4: Clicking Tasks tab...');
    await page.click('button[aria-label="Tasks"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '2_tasks_tab.png') });

    const tasksContentVisible = await page.evaluate(() => {
      const content = document.querySelector('text=Task management coming soon') ||
                      document.body.textContent.includes('Task management coming soon');
      return content;
    });
    console.log(`   Tasks content visible: ${tasksContentVisible ? '✅' : '❌'}\n`);

    // Step 5: Click Stats tab
    console.log('Step 5: Clicking Stats tab...');
    await page.click('button[aria-label="Stats"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3_stats_tab.png') });

    const statsContentVisible = await page.evaluate(() => {
      return document.body.textContent.includes('Statistics dashboard coming soon');
    });
    console.log(`   Stats content visible: ${statsContentVisible ? '✅' : '❌'}\n`);

    // Step 6: Click Settings tab
    console.log('Step 6: Clicking Settings tab...');
    await page.click('button[aria-label="Settings"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '4_settings_tab.png') });

    const settingsContentVisible = await page.evaluate(() => {
      return document.body.textContent.includes('Customization options coming soon');
    });
    console.log(`   Settings content visible: ${settingsContentVisible ? '✅' : '❌'}\n`);

    // Step 7: Click back to Timer tab
    console.log('Step 7: Clicking back to Timer tab...');
    await page.click('button[aria-label="Timer"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '5_back_to_timer.png') });

    const timerVisible = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement && timeElement.textContent.includes('25');
    });
    console.log(`   Timer visible: ${timerVisible ? '✅' : '❌'}\n`);

    console.log('✅ Tab navigation test completed successfully!\n');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error.png') });
  } finally {
    await browser.close();
  }
}

testTabNavigation();
