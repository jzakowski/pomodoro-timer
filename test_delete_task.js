const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🗑️  Testing delete task functionality...\n');

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

    // 3. Create a test task if none exists
    console.log('3. Creating test task...');
    const taskInput = page.locator('input[placeholder="What are you working on?"]');
    const taskCountBefore = await page.locator('text=/No tasks yet|Progress/').count();

    if (await page.locator('text=No tasks yet').isVisible()) {
      await taskInput.fill('Test Task for Deletion');
      await page.locator('button', { hasText: 'Add' }).click();
      await page.waitForTimeout(500);
      console.log('   ✓ Test task created\n');
    } else {
      console.log('   ✓ Tasks already exist\n');
    }

    // 4. Count tasks before deletion
    const tasksBefore = await page.locator('text=/Progress/').count();
    console.log(`4. Tasks before deletion: ${tasksBefore}\n`);

    // 5. Set up dialog handler and click delete button
    console.log('5. Clicking delete button...');
    page.on('dialog', async dialog => {
      console.log(`   ✓ Confirmation dialog appeared: "${dialog.message()}"`);
      await dialog.accept();
    });

    const deleteButton = page.locator('button', { hasText: 'Delete' }).first();
    await deleteButton.click();
    await page.waitForTimeout(500);

    // 7. Verify task was deleted
    console.log('\n6. Verifying deletion...');
    const tasksAfter = await page.locator('text=/Progress/').count();
    console.log(`   Tasks after deletion: ${tasksAfter}`);

    if (tasksAfter < tasksBefore) {
      console.log('   ✅ Task deleted successfully!\n');

      // Take screenshot
      const screenshotPath = path.join(__dirname, 'screenshots', 'task_deleted.png');
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Screenshot saved: ${screenshotPath}\n`);
    } else {
      console.log('   ❌ Task was NOT deleted\n');
    }

    console.log('✅ Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
