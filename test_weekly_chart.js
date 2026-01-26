/**
 * Test script for weekly chart feature (Issue #41)
 * Verifies that the weekly bar chart displays correctly
 */

const { chromium } = require('playwright');

async function testWeeklyChart() {
  console.log('📊 Testing Weekly Chart Feature (Issue #41)\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage();

  try {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('1. Loading app...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Add some test data to localStorage to simulate sessions over the week
    console.log('\n2. Adding test session data...');
    await page.evaluate(() => {
      const today = new Date();
      const testData = {};

      // Add sessions for the past 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Add varying number of sessions per day
        const sessions = i === 0 ? 5 : i === 1 ? 3 : Math.floor(Math.random() * 4) + 1;
        testData[dateStr] = sessions;
      }

      // Save to localStorage
      const stats = {
        totalSessions: 15,
        totalMinutes: 375,
        currentStreak: 3,
        bestStreak: 7,
        sessionsByDate: testData,
        sessionHistory: []
      };
      localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
    });
    console.log('   ✓ Test data added');

    // Reload to apply the test data
    console.log('\n3. Reloading page with test data...');
    await page.reload();
    await page.waitForTimeout(2000);

    // Navigate to Stats tab
    console.log('\n4. Navigating to Stats tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const statsButton = buttons.find(btn =>
        btn.getAttribute('aria-label') === 'Stats' &&
        btn.offsetParent !== null
      );
      if (statsButton) {
        statsButton.click();
      }
    });
    await page.waitForTimeout(1000);
    console.log('   ✓ Stats tab opened');

    // Check if weekly chart is visible
    console.log('\n5. Verifying weekly chart...');
    const chartTitle = await page.isVisible('text=This Week');
    console.log(`   Chart title visible: ${chartTitle}`);

    // Check for bar chart container
    const chartContainer = await page.evaluate(() => {
      const chartSection = document.querySelector('bg-white.dark\\:bg-gray-800');
      return chartSection !== null;
    });

    // Look for the weekly chart section
    const weeklyChartExists = await page.evaluate(() => {
      const h3Elements = Array.from(document.querySelectorAll('h3'));
      return h3Elements.some(h3 => h3.textContent === 'This Week');
    });
    console.log(`   Weekly chart section exists: ${weeklyChartExists}`);

    if (weeklyChartExists) {
      // Count the number of bars (should be 7)
      const barCount = await page.evaluate(() => {
        const bars = document.querySelectorAll('[class*="rounded-t-lg"]');
        return bars.length;
      });
      console.log(`   Number of bars: ${barCount}`);

      // Check for day labels
      const dayLabels = await page.evaluate(() => {
        const labels = Array.from(document.querySelectorAll('p'))
          .filter(p => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(p.textContent))
          .map(p => p.textContent);
        return labels;
      });
      console.log(`   Day labels: ${dayLabels.join(', ')}`);

      // Check if today's bar is highlighted (red)
      const todayHighlighted = await page.evaluate(() => {
        const redBars = document.querySelectorAll('.bg-red-500');
        return redBars.length > 0;
      });
      console.log(`   Today's bar highlighted: ${todayHighlighted}`);

      // Check legend
      const legendExists = await page.isVisible('text=Past days');
      const legendTodayExists = await page.isVisible('text=Today');
      console.log(`   Legend visible: ${legendExists && legendTodayExists}`);

      // Take screenshot
      await page.screenshot({ path: 'screenshots/weekly_chart.png' });
      console.log('\n   📸 Screenshot saved: screenshots/weekly_chart.png');

      if (barCount === 7 && dayLabels.length === 7 && todayHighlighted) {
        console.log('\n✅ Weekly chart feature working correctly!');
        console.log('   - 7 bars displayed');
        console.log('   - Day labels shown');
        console.log('   - Today highlighted');
      } else {
        console.log('\n⚠️  Chart partially working:');
        console.log(`   - Bars: ${barCount}/7`);
        console.log(`   - Labels: ${dayLabels.length}/7`);
        console.log(`   - Today highlighted: ${todayHighlighted}`);
      }
    } else {
      console.log('\n   ❌ Weekly chart not found!');
    }

    console.log('\n✅ Test completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

testWeeklyChart().catch(console.error);
