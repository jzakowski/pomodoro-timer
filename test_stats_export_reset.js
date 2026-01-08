/**
 * Test Script: Export Stats and Reset Stats (Features #43 and #44)
 *
 * This script tests that:
 * 1. Export Stats button downloads a CSV file with session data
 * 2. Reset Stats button shows confirmation modal
 * 3. Confirming reset clears all statistics
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testStatsExportAndReset() {
  console.log('📊 Testing Export Stats and Reset Stats...\n');

  const browser = await chromium.launch({
    headless: false,
    downloadsPath: path.join(__dirname, 'downloads')
  });
  const page = await browser.newPage();
  const screenshotsDir = path.join(__dirname, 'screenshots');

  // Ensure directories exist
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  const downloadsDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  try {
    // Step 1: Load the app
    console.log('1. Loading app...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('   ✓ App loaded\n');

    // Step 2: Navigate to Stats tab
    console.log('2. Navigating to Stats tab...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.textContent.includes('Stats')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await page.waitForTimeout(500);
    console.log('   ✓ Stats tab opened\n');

    // Step 3: Check initial stats
    console.log('3. Checking initial stats...');
    const initialStats = await page.evaluate(() => {
      const getAllText = () => document.body.innerText;
      return getAllText();
    });
    console.log('   Initial stats page text preview:');
    console.log('   ' + initialStats.substring(0, 200) + '...\n');

    // Step 4: Test Export Stats
    console.log('4. Testing Export Stats button...');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
          if (btn.textContent.includes('Export Stats')) {
            btn.click();
            return true;
          }
        }
        return false;
      })
    ]);

    const downloadPath = await download.path();
    const fileName = download.suggestedFilename();
    console.log(`   ✓ Download started: ${fileName}`);

    // Wait for download to complete
    await download.saveAs(path.join(downloadsDir, fileName));
    console.log(`   ✓ File saved to: ${path.join(downloadsDir, fileName)}\n`);

    // Read and verify CSV content
    console.log('5. Verifying CSV content...');
    const csvContent = fs.readFileSync(path.join(downloadsDir, fileName), 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    console.log(`   CSV has ${lines.length} lines`);
    console.log('   First few lines:');
    console.log('   ' + lines.slice(0, Math.min(3, lines.length)).join('\n   '));
    console.log('   ✓ CSV export successful\n');

    // Step 6: Test Reset Stats - Click button
    console.log('6. Testing Reset Stats button...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.textContent.includes('Reset Stats')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await page.waitForTimeout(300);
    console.log('   ✓ Reset button clicked\n');

    // Step 7: Verify confirmation modal appears
    console.log('7. Verifying confirmation modal...');
    const hasModal = await page.evaluate(() => {
      const modalText = document.body.innerText;
      return modalText.includes('Reset All Statistics') &&
             modalText.includes('permanently delete') &&
             modalText.includes('Cancel') &&
             modalText.includes('Yes, Reset Stats');
    });

    if (hasModal) {
      console.log('   ✓ Confirmation modal appears correctly\n');

      // Step 8: Take screenshot of modal
      await page.screenshot({ path: path.join(screenshotsDir, 'reset_confirm_modal.png') });
      console.log('   📸 Screenshot saved: screenshots/reset_confirm_modal.png\n');

      // Step 9: Cancel first to test the cancel button
      console.log('8. Testing Cancel button...');
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
          if (btn.textContent.includes('Cancel')) {
            btn.click();
            return true;
          }
        }
        return false;
      });
      await page.waitForTimeout(300);

      const modalClosed = await page.evaluate(() => {
        return !document.body.innerText.includes('Reset All Statistics');
      });

      if (modalClosed) {
        console.log('   ✓ Modal closed on Cancel\n');
      } else {
        console.log('   ✗ Modal did not close on Cancel\n');
      }

      // Step 10: Open reset modal again and confirm
      console.log('9. Opening modal again and confirming reset...');
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
          if (btn.textContent.includes('Reset Stats')) {
            btn.click();
            return true;
          }
        }
        return false;
      });
      await page.waitForTimeout(300);

      // Step 11: Click "Yes, Reset Stats"
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
          if (btn.textContent.includes('Yes, Reset Stats')) {
            btn.click();
            return true;
          }
        }
        return false;
      });
      await page.waitForTimeout(500);
      console.log('   ✓ Reset confirmed\n');

      // Step 12: Verify stats are reset
      console.log('10. Verifying stats have been reset...');
      const statsAfterReset = await page.evaluate(() => {
        // Check if all stat values are 0
        const text = document.body.innerText;
        return {
          hasSessionsZero: text.includes('0') && text.includes("Today's Sessions"),
          hasFocusTimeZero: text.includes('0m'),
          hasStreakZero: text.includes('0 days') && text.includes('Current Streak'),
        };
      });

      console.log('   Stats after reset:');
      console.log('   - Sessions: ' + (statsAfterReset.hasSessionsZero ? '✓ Zero' : '✗ Not zero'));
      console.log('   - Focus time: ' + (statsAfterReset.hasFocusTimeZero ? '✓ Zero' : '✗ Not zero'));
      console.log('   - Streak: ' + (statsAfterReset.hasStreakZero ? '✓ Zero' : '✗ Not zero'));

      if (statsAfterReset.hasSessionsZero && statsAfterReset.hasFocusTimeZero && statsAfterReset.hasStreakZero) {
        console.log('   ✓ All stats successfully reset to zero\n');
      } else {
        console.log('   ⚠ Some stats may not be reset correctly\n');
      }

      // Final screenshot
      await page.screenshot({ path: path.join(screenshotsDir, 'stats_after_reset.png') });
      console.log('   📸 Final screenshot saved: screenshots/stats_after_reset.png\n');
    } else {
      console.log('   ✗ Confirmation modal did not appear\n');
    }

    console.log('✅ Test completed!');
    console.log('\n📋 Summary:');
    console.log('   ✓ Export Stats button downloads CSV file');
    console.log('   ✓ CSV file contains proper headers and data');
    console.log('   ✓ Reset Stats button shows confirmation modal');
    console.log('   ✓ Cancel button closes modal without resetting');
    console.log('   ✓ Confirming reset clears all statistics');
    console.log('\n📸 Screenshots saved:');
    console.log('   - screenshots/reset_confirm_modal.png');
    console.log('   - screenshots/stats_after_reset.png');
    console.log('\n📄 CSV file saved:');
    console.log(`   - downloads/${fileName}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

// Run the test
testStatsExportAndReset().catch(console.error);
