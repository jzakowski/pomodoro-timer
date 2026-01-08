const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🗑️  Testing delete task CANCELLATION...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Load the app
    console.log('1. Loading app...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    console.log('   ✓ App loaded\n');

    // 2. Navigate to Tasks tab
    console.log('2. Clicking Tasks tab...');
    await page.locator('button[aria-label="Tasks"]').nth(1).click();
    await page.waitForTimeout(500);
    console.log('   ✓ Tasks tab opened\n');

    // 3. Create a test task
    console.log('3. Creating test task...');
    await page.locator('input[placeholder="What are you working on?"]').fill('Task to Keep');
    await page.locator('button', { hasText: 'Add' }).click();
    await page.waitForTimeout(500);
    console.log('   ✓ Test task created\n');

    // 4. Count tasks before
    const tasksBefore = await page.locator('text=/Progress/').count();
    console.log(`4. Tasks before deletion attempt: ${tasksBefore}\n`);

    // 5. Click delete but CANCEL the dialog
    console.log('5. Clicking delete button and CANCELLING...');
    page.on('dialog', async dialog => {
      console.log(`   ✓ Confirmation dialog appeared: "${dialog.message()}"`);
      console.log('   Dismissing dialog (cancelling deletion)...');
      await dialog.dismiss();
    });

    const deleteButton = page.locator('button', { hasText: 'Delete' }).first();
    await deleteButton.click();
    await page.waitForTimeout(500);

    // 6. Verify task was NOT deleted
    console.log('\n6. Verifying task was NOT deleted...');
    const tasksAfter = await page.locator('text=/Progress/').count();
    console.log(`   Tasks after cancellation: ${tasksAfter}`);

    if (tasksAfter === tasksBefore) {
      console.log('   ✅ Task was preserved (not deleted)!\n');

      // Take screenshot
      const screenshotPath = path.join(__dirname, 'screenshots', 'task_delete_cancelled.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Screenshot saved: ${screenshotPath}\n`);
    } else {
      console.log('   ❌ Task was deleted (cancellation failed!)\n');
    }

    console.log('✅ Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
