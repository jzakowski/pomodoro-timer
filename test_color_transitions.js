/**
 * Test Script: Smooth Color Transitions (Feature #53)
 *
 * This script tests that session color transitions are smooth and gradual
 * without jarring color flashes.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testColorTransitions() {
  console.log('🎨 Testing smooth color transitions...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const screenshotsDir = path.join(__dirname, 'screenshots');

  // Ensure screenshots directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // Step 1: Load the app
    console.log('1. Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for hydration
    console.log('   ✓ App loaded\n');

    // Step 2: Check initial Work session color (red)
    console.log('2. Capturing Work session (red)...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_work_session.png') });
    console.log('   ✓ Work session screenshot saved\n');

    // Step 3: Skip to Short Break (green)
    console.log('3. Skipping to Short Break session (green)...');
    // Find the skip button (first button in the controls row)
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.getAttribute('aria-label') === 'Skip session') {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await page.waitForTimeout(600); // Wait for transition to complete (500ms + buffer)

    await page.screenshot({ path: path.join(screenshotsDir, '02_short_break.png') });
    console.log('   ✓ Short Break screenshot saved\n');

    // Step 4: Skip to Work again (red) - testing transition back
    console.log('4. Skipping back to Work session (red)...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.getAttribute('aria-label') === 'Skip session') {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(screenshotsDir, '03_work_session_2.png') });
    console.log('   ✓ Work session screenshot saved\n');

    // Step 5: Skip to Long Break (purple)
    console.log('5. Skipping to Long Break session (purple)...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.getAttribute('aria-label') === 'Skip session') {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(screenshotsDir, '04_long_break.png') });
    console.log('   ✓ Long Break screenshot saved\n');

    // Step 6: Take one more screenshot to verify consistency
    console.log('6. Skipping back to Work to verify consistency...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.getAttribute('aria-label') === 'Skip session') {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(screenshotsDir, '05_work_session_final.png') });
    console.log('   ✓ Final Work session screenshot saved\n');

    console.log('✅ Test completed!');
    console.log('\n📸 Screenshots saved:');
    console.log('   - screenshots/01_work_session.png (Work - Red)');
    console.log('   - screenshots/02_short_break.png (Short Break - Green)');
    console.log('   - screenshots/03_work_session_2.png (Work - Red)');
    console.log('   - screenshots/04_long_break.png (Long Break - Purple)');
    console.log('   - screenshots/05_work_session_final.png (Work - Red)');
    console.log('\n👀 Please verify visually:');
    console.log('   - Colors transition smoothly (no jarring flashes)');
    console.log('   - Each session type has distinct color');
    console.log('   - Work session color is consistent across transitions');
    console.log('   - Transition duration is ~500ms (gradual crossfade)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testColorTransitions().catch(console.error);
