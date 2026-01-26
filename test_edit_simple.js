/**
 * Simple Test for Edit Task Feature (Issue #28)
 * Tests basic edit functionality
 */

const { chromium } = require('playwright');

async function testEditTask() {
  console.log('🧪 Starting Edit Task Test...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const page = await browser.newPage();

  try {
    // Navigate to app
    console.log('📍 Navigating to app...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Go to Tasks tab
    console.log('📍 Opening Tasks tab...');
    await page.getByRole('button', { name: /tasks/i }).click();
    await page.waitForTimeout(500);

    // Create test task
    console.log('📍 Creating test task...');
    await page.fill('input[placeholder="What are you working on?"]', 'Test Task');
    await page.click('button:has-text("Add")');
    await page.waitForTimeout(500);

    // Click edit button
    console.log('📍 Clicking edit button...');
    const editButton = page.locator('button[aria-label="Edit task"]').first();
    await editButton.click();
    await page.waitForTimeout(300);

    // Verify edit mode
    console.log('📍 Verifying edit mode...');
    const allInputs = page.locator('input[type="text"]');
    const count = await allInputs.count();
    console.log(`Found ${count} text inputs`);

    const editInput = allInputs.nth(count - 1);
    const inputValue = await editInput.inputValue();
    console.log(`Edit input value: "${inputValue}"`);

    if (inputValue !== 'Test Task') {
      throw new Error(`Expected "Test Task", got "${inputValue}"`);
    }
    console.log('✅ Edit mode activated with correct value\n');

    // Update title
    console.log('📍 Updating task title...');
    await editInput.clear();
    await editInput.fill('Updated Task');
    await page.waitForTimeout(200);

    // Save with Enter
    console.log('📍 Saving with Enter key...');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Verify updated
    console.log('📍 Verifying update...');
    const updatedText = page.getByText('Updated Task');
    const isVisible = await updatedText.isVisible();

    if (!isVisible) {
      // Try to find it in an h3
      const h3Text = await page.locator('h3').allTextContents();
      console.log('All h3 texts:', h3Text);

      if (!h3Text.includes('Updated Task')) {
        throw new Error('Task title was not updated!');
      }
    }

    console.log('✅ Task title updated successfully!\n');

    // Test cancel functionality
    console.log('📍 Testing cancel...');
    await editButton.click();
    await page.waitForTimeout(300);

    const allInputs2 = page.locator('input[type="text"]');
    const editInput2 = allInputs2.nth(await allInputs2.count() - 1);

    await editInput2.fill('Cancel This');
    await page.waitForTimeout(200);

    // Click cancel button
    console.log('📍 Clicking cancel button...');
    const cancelButton = page.locator('button[aria-label="Cancel edit"]');
    await cancelButton.click();
    await page.waitForTimeout(500);

    // Verify still shows "Updated Task"
    const stillUpdated = page.getByText('Updated Task');
    const isStillVisible = await stillUpdated.isVisible();

    if (!isStillVisible) {
      throw new Error('Cancel did not work - title was changed!');
    }

    console.log('✅ Cancel works correctly!\n');

    console.log('🎉 All tests PASSED!\n');

  } catch (error) {
    console.error('❌ Test FAILED:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

testEditTask()
  .then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
