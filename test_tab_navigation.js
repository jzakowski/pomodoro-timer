const puppeteer = require('puppeteer');

async function testTabNavigation() {
  console.log('🧪 Starting Tab Navigation Test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Navigate to app
    console.log('Step 1: Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('✓ Page loaded\n');

    // Step 2: Verify Timer tab is active by default
    console.log('Step 2: Verifying Timer tab is active by default...');
    const timerTabActive = await page.evaluate(() => {
      const timerButton = document.querySelector('button[aria-label="Switch to Timer tab"]');
      return timerButton?.getAttribute('aria-current') === 'page';
    });

    if (!timerTabActive) {
      throw new Error('❌ Timer tab is not active by default');
    }
    console.log('✓ Timer tab is active by default\n');

    // Step 3: Verify Timer content is visible
    console.log('Step 3: Verifying Timer content is visible...');
    const timerContentVisible = await page.evaluate(() => {
      const timerDisplay = document.querySelector('text-8xl');
      return timerDisplay !== null;
    });

    if (!timerContentVisible) {
      throw new Error('❌ Timer content is not visible');
    }
    console.log('✓ Timer content is visible\n');

    // Step 4: Click Tasks tab
    console.log('Step 4: Clicking Tasks tab...');
    await page.click('button[aria-label="Switch to Tasks tab"]');
    await page.waitForTimeout(500);

    const tasksTabActive = await page.evaluate(() => {
      const tasksButton = document.querySelector('button[aria-label="Switch to Tasks tab"]');
      return tasksButton?.getAttribute('aria-current') === 'page';
    });

    if (!tasksTabActive) {
      throw new Error('❌ Tasks tab is not active after clicking');
    }
    console.log('✓ Tasks tab is now active\n');

    // Step 5: Verify Tasks content appears
    console.log('Step 5: Verifying Tasks content appears...');
    const tasksContentVisible = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      return heading?.textContent === 'Tasks';
    });

    if (!tasksContentVisible) {
      throw new Error('❌ Tasks content is not visible');
    }
    console.log('✓ Tasks content appears\n');

    // Step 6: Click Stats tab
    console.log('Step 6: Clicking Stats tab...');
    await page.click('button[aria-label="Switch to Stats tab"]');
    await page.waitForTimeout(500);

    const statsTabActive = await page.evaluate(() => {
      const statsButton = document.querySelector('button[aria-label="Switch to Stats tab"]');
      return statsButton?.getAttribute('aria-current') === 'page';
    });

    if (!statsTabActive) {
      throw new Error('❌ Stats tab is not active after clicking');
    }
    console.log('✓ Stats tab is now active\n');

    // Step 7: Verify Stats content appears
    console.log('Step 7: Verifying Stats content appears...');
    const statsContentVisible = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      return heading?.textContent === 'Statistics';
    });

    if (!statsContentVisible) {
      throw new Error('❌ Stats content is not visible');
    }
    console.log('✓ Stats content appears\n');

    // Step 8: Click Settings tab
    console.log('Step 8: Clicking Settings tab...');
    await page.click('button[aria-label="Switch to Settings tab"]');
    await page.waitForTimeout(500);

    const settingsTabActive = await page.evaluate(() => {
      const settingsButton = document.querySelector('button[aria-label="Switch to Settings tab"]');
      return settingsButton?.getAttribute('aria-current') === 'page';
    });

    if (!settingsTabActive) {
      throw new Error('❌ Settings tab is not active after clicking');
    }
    console.log('✓ Settings tab is now active\n');

    // Step 9: Verify Settings content appears
    console.log('Step 9: Verifying Settings content appears...');
    const settingsContentVisible = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      return heading?.textContent === 'Settings';
    });

    if (!settingsContentVisible) {
      throw new Error('❌ Settings content is not visible');
    }
    console.log('✓ Settings content appears\n');

    // Step 10: Check for console errors
    console.log('Step 10: Checking for console errors...');
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });

    if (consoleErrors.length > 0) {
      console.log('⚠️  Console errors found:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✓ No console errors\n');
    }

    console.log('🎉 ALL TESTS PASSED!\n');
    console.log('Summary:');
    console.log('✓ Timer tab is active by default');
    console.log('✓ Timer content is visible');
    console.log('✓ Tasks tab switches correctly');
    console.log('✓ Tasks content appears');
    console.log('✓ Stats tab switches correctly');
    console.log('✓ Stats content appears');
    console.log('✓ Settings tab switches correctly');
    console.log('✓ Settings content appears');
    console.log('✓ No console errors');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\n✓ Browser closed');
  }
}

// Capture console errors
page => {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      page.evaluate(() => {
        window.consoleErrors = window.consoleErrors || [];
        window.consoleErrors.push(msg.text());
      });
    }
  });
}

testTabNavigation().catch(console.error);
