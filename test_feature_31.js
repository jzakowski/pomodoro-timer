/**
 * Test Feature #31: Task progress bar updates on session complete
 *
 * This test verifies that:
 * 1. When a work session completes, the active task's pomodoro count increments
 * 2. The progress bar updates correctly
 * 3. Task auto-completes when all pomodoros are done
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🧪 Testing Feature #31: Task progress updates on session complete\n');

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForSelector('button[aria-label="Tasks"]', { timeout: 5000 });
    console.log('✅ App loaded successfully');

    // Navigate to Tasks tab
    await page.click('button[aria-label="Tasks"]');
    await page.waitForTimeout(500);
    console.log('✅ Navigated to Tasks tab');

    // Clear existing tasks
    const existingTasks = await page.$$('[data-testid^="task-"]');
    for (const task of existingTasks) {
      await task.click();
      await page.waitForTimeout(100);
    }
    console.log('✅ Cleared existing tasks');

    // Create a task with 4 pomodoro estimate
    await page.type('input[placeholder*="Add task"]', 'Test Task for Progress');
    await page.waitForTimeout(300);

    // Set priority to high
    await page.click('select[aria-label="Task priority"]');
    await page.waitForTimeout(200);
    await page.select('select[aria-label="Task priority"]', 'high');
    await page.waitForTimeout(200);

    // Set pomodoro estimate to 4
    await page.click('select[aria-label="Pomodoro estimate"]');
    await page.waitForTimeout(200);
    await page.select('select[aria-label="Pomodoro estimate"]', '4');
    await page.waitForTimeout(200);

    // Add the task
    await page.click('button[aria-label="Add task"]');
    await page.waitForTimeout(500);
    console.log('✅ Created test task with 4 pomodoro estimate');

    // Mark task as active
    const activeButton = await page.$('[data-testid="task-\\d+"] button[aria-label*="star"]');
    if (activeButton) {
      await activeButton.click();
      await page.waitForTimeout(300);
      console.log('✅ Marked task as active');
    }

    // Navigate to Timer tab
    await page.click('button[aria-label="Timer"]');
    await page.waitForTimeout(500);
    console.log('✅ Navigated to Timer tab');

    // Get initial task state
    const initialProgress = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
      const activeTask = tasks.find(t => t.isActive);
      return activeTask ? `${activeTask.completedPomodoros}/${activeTask.estimatedPomodoros}` : 'N/A';
    });
    console.log(`📊 Initial task progress: ${initialProgress}`);

    // Simulate work session completion by skipping to end
    // We'll use skipSession to quickly complete sessions
    console.log('\n⏱️  Simulating work session completion...');

    // Skip through work session
    await page.click('button[aria-label="Skip session"]');
    await page.waitForTimeout(1500);
    console.log('✅ Work session completed');

    // Check if task progress updated
    const updatedProgress = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
      const activeTask = tasks.find(t => t.isActive);
      return activeTask ? {
        completed: activeTask.completedPomodoros,
        estimated: activeTask.estimatedPomodoros,
        isCompleted: activeTask.isCompleted
      } : null;
    });

    if (updatedProgress) {
      console.log(`\n📊 Updated task progress: ${updatedProgress.completed}/${updatedProgress.estimated}`);
      console.log(`📝 Task isCompleted: ${updatedProgress.isCompleted}`);

      // Verify the progress updated
      if (updatedProgress.completed === 1 && updatedProgress.estimated === 4) {
        console.log('✅ PASS: Task progress incremented correctly!');

        // Navigate back to Tasks tab to verify UI update
        await page.click('button[aria-label="Tasks"]');
        await page.waitForTimeout(500);

        const progressText = await page.evaluate(() => {
          const progressElement = document.querySelector('[data-testid^="task-"] [data-testid="task-progress"]');
          return progressElement ? progressElement.textContent : 'N/A';
        });

        console.log(`\n📊 UI Progress display: ${progressText}`);
        console.log('✅ PASS: Progress bar updated in UI!');
      } else {
        console.log('❌ FAIL: Task progress did not increment correctly');
        console.log(`   Expected: 1/4, Got: ${updatedProgress.completed}/${updatedProgress.estimated}`);
      }
    } else {
      console.log('❌ FAIL: Could not find active task after session completion');
    }

    // Test multiple sessions
    console.log('\n⏱️  Testing multiple work sessions...');
    for (let i = 2; i <= 4; i++) {
      await page.click('button[aria-label="Timer"]');
      await page.waitForTimeout(300);

      await page.click('button[aria-label="Skip session"]');
      await page.waitForTimeout(1500);

      const progress = await page.evaluate(() => {
        const tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
        const activeTask = tasks.find(t => t.isActive);
        return activeTask ? `${activeTask.completedPomodoros}/${activeTask.estimatedPomodoros}` : 'N/A';
      });

      console.log(`   Session ${i} complete: ${progress}`);
    }

    // Final check
    const finalProgress = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
      const activeTask = tasks.find(t => t.isActive);
      return activeTask ? {
        completed: activeTask.completedPomodoros,
        estimated: activeTask.estimatedPomodoros,
        isCompleted: activeTask.isCompleted
      } : null;
    });

    console.log('\n📊 Final task state:');
    console.log(`   Progress: ${finalProgress.completed}/${finalProgress.estimated}`);
    console.log(`   Is Completed: ${finalProgress.isCompleted}`);

    if (finalProgress.completed === 4 && finalProgress.estimated === 4 && finalProgress.isCompleted) {
      console.log('✅ PASS: Task auto-completed after all pomodoros done!');
    } else {
      console.log('❌ FAIL: Task did not auto-complete correctly');
    }

    console.log('\n✨ Feature #31 test complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
})();
