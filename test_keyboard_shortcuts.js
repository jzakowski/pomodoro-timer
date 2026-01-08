/**
 * Test Script: Keyboard Shortcuts (Space and R keys)
 * Issue: #47 - Keyboard shortcut Space starts/pauses timer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'tests/verification/issue_47_keyboard_shortcuts');

// Create screenshot directory
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function testKeyboardShortcuts() {
  console.log('🧪 Testing Keyboard Shortcuts (Space and R keys)...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Step 1: Navigate to app
    console.log('Step 1: Navigating to app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1_initial_state.png') });
    console.log('   ✅ Page loaded\n');

    // Step 2: Get initial timer value
    console.log('Step 2: Getting initial timer value...');
    const initialTime = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement ? timeElement.textContent : null;
    });
    console.log(`   Initial timer: ${initialTime}\n`);

    // Step 3: Press Space key to start timer
    console.log('Step 3: Pressing Space key to start timer...');
    await page.keyboard.press('Space');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '2_after_space_start.png') });
    await page.waitForTimeout(2000); // Wait 2 seconds

    // Step 4: Check timer is running
    console.log('Step 4: Checking timer is running...');
    const timeAfterStart = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement ? timeElement.textContent : null;
    });
    console.log(`   Timer after 2s: ${timeAfterStart}`);

    if (timeAfterStart !== initialTime) {
      console.log('   ✅ PASS: Timer started with Space key\n');
    } else {
      throw new Error('❌ FAIL: Timer did not start with Space key');
    }

    // Step 5: Press Space key again to pause
    console.log('Step 5: Pressing Space key again to pause...');
    const timeBeforePause = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement ? timeElement.textContent : null;
    });

    await page.keyboard.press('Space');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3_after_space_pause.png') });
    await page.waitForTimeout(2000);

    // Step 6: Check timer is paused
    console.log('Step 6: Checking timer is paused...');
    const timeAfterPause = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement ? timeElement.textContent : null;
    });
    console.log(`   Timer before pause: ${timeBeforePause}`);
    console.log(`   Timer after 2s: ${timeAfterPause}`);

    if (timeAfterPause === timeBeforePause) {
      console.log('   ✅ PASS: Timer paused with Space key\n');
    } else {
      throw new Error('❌ FAIL: Timer did not pause with Space key');
    }

    // Step 7: Press R key to reset timer
    console.log('Step 7: Pressing R key to reset timer...');
    await page.keyboard.press('r'); // lowercase 'r'
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '4_after_r_reset.png') });

    // Step 8: Check timer is reset
    console.log('Step 8: Checking timer is reset...');
    const timeAfterReset = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement ? timeElement.textContent : null;
    });
    console.log(`   Timer after reset: ${timeAfterReset}`);

    if (timeAfterReset === '25:00') {
      console.log('   ✅ PASS: Timer reset with R key\n');
    } else {
      throw new Error('❌ FAIL: Timer did not reset with R key');
    }

    // Step 9: Test Space key one more time to start again
    console.log('Step 9: Pressing Space key again to restart timer...');
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000);

    const timeAfterRestart = await page.evaluate(() => {
      const timeElement = document.querySelector('.tabular-nums');
      return timeElement ? timeElement.textContent : null;
    });
    console.log(`   Timer after restart: ${timeAfterRestart}`);

    if (timeAfterRestart !== '25:00') {
      console.log('   ✅ PASS: Timer restarted with Space key\n');
    } else {
      throw new Error('❌ FAIL: Timer did not restart with Space key');
    }

    console.log('✅ All keyboard shortcut tests passed!\n');

    // Final screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '5_final_state.png') });

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error.png') });
    throw error;
  } finally {
    await browser.close();
  }

  console.log('📋 Test Summary:');
  console.log('   ✓ Space key starts timer');
  console.log('   ✓ Space key pauses timer');
  console.log('   ✓ R key resets timer');
  console.log('   ✓ Space key toggles timer state\n');

  console.log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}\n`);
}

// Run tests
testKeyboardShortcuts()
  .then(() => {
    console.log('✅ Test suite completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
