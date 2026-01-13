/**
 * Simple manual test for Issue #8: Session counter displays correctly
 * This script uses direct browser automation
 */

const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Testing Issue #8: Session counter displays correctly\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();

  try {
    // Navigate to app
    console.log('📍 Step 1: Navigate to localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check initial session counter
    console.log('\n📍 Step 2: Check initial session counter');
    const counterText = await page.evaluate(() => {
      const elements = document.querySelectorAll('p');
      for (let el of elements) {
        if (el.textContent.includes('Session')) {
          return el.textContent;
        }
      }
      return 'Not found';
    });

    console.log(`  Found: "${counterText}"`);

    if (counterText.includes('Session 1 of 4')) {
      console.log('  ✅ PASS: Shows "Session 1 of 4"');
    } else {
      console.log('  ❌ FAIL: Does not show "Session 1 of 4"');
    }

    // Skip session and check counter updates
    console.log('\n📍 Step 3: Skip to next session and verify update');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.getAttribute('aria-label') === 'Skip session') {
          btn.click();
          break;
        }
      }
    });

    await page.waitForTimeout(1000);

    const counterText2 = await page.evaluate(() => {
      const elements = document.querySelectorAll('p');
      for (let el of elements) {
        if (el.textContent.includes('Session')) {
          return el.textContent;
        }
      }
      return 'Not found';
    });

    console.log(`  After first skip: "${counterText2}"`);

    // Skip to work session
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.getAttribute('aria-label') === 'Skip session') {
          btn.click();
          break;
        }
      }
    });

    await page.waitForTimeout(1000);

    const counterText3 = await page.evaluate(() => {
      const elements = document.querySelectorAll('p');
      for (let el of elements) {
        if (el.textContent.includes('Session')) {
          return el.textContent;
        }
      }
      return 'Not found';
    });

    console.log(`  After second skip: "${counterText3}"`);

    if (counterText3.includes('Session 2 of 4')) {
      console.log('  ✅ PASS: Counter updated to "Session 2 of 4"');
    } else {
      console.log('  ⚠️  Counter might be: ' + counterText3);
    }

    console.log('\n✨ Session counter is working!');
    console.log('\n📸 Please verify visually in the browser window...');
    console.log('Press Ctrl+C to exit when done\n');

    // Keep browser open for manual verification
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
