#!/usr/bin/env node

/**
 * Test script to verify that stats update automatically after completing a session
 */

const puppeteer = require('puppeteer');

async function testStatsUpdate() {
  console.log('🧪 Testing: Stats update automatically after session completion\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    // Wait for the app to load
    await page.waitForSelector('h1', { timeout: 5000 });

    console.log('✓ App loaded successfully');

    // Navigate to Stats tab and get initial session count
    await page.click('button[aria-label="Stats"]');
    await page.waitForTimeout(500);

    let initialSessions = await page.evaluate(() => {
      const statsCards = document.querySelectorAll('p.text-3xl.font-bold');
      return parseInt(statsCards[0]?.textContent || '0');
    });

    console.log(`✓ Initial session count: ${initialSessions}`);

    // Navigate back to Timer tab
    await page.click('button[aria-label="Timer"]');
    await page.waitForTimeout(500);

    // For testing, we'll manually add a pending session to localStorage
    // This simulates completing a timer session
    await page.evaluate(() => {
      const sessionData = {
        type: 'work',
        duration: 1500, // 25 minutes in seconds
        timestamp: Date.now()
      };

      const pendingSessions = JSON.parse(localStorage.getItem('pomodoro_pending_sessions') || '[]');
      pendingSessions.push(sessionData);
      localStorage.setItem('pomodoro_pending_sessions', JSON.stringify(pendingSessions));

      // Trigger storage event
      window.dispatchEvent(new Event('local-storage'));
    });

    console.log('✓ Simulated session completion');

    // Wait for stats to update
    await page.waitForTimeout(1000);

    // Navigate to Stats tab
    await page.click('button[aria-label="Stats"]');
    await page.waitForTimeout(500);

    // Get updated session count
    let updatedSessions = await page.evaluate(() => {
      const statsCards = document.querySelectorAll('p.text-3xl.font-bold');
      return parseInt(statsCards[0]?.textContent || '0');
    });

    console.log(`✓ Updated session count: ${updatedSessions}`);

    // Verify the count increased by 1
    if (updatedSessions === initialSessions + 1) {
      console.log('\n✅ TEST PASSED: Stats updated automatically after session completion');
      console.log(`   Session count increased from ${initialSessions} to ${updatedSessions}`);
      process.exit(0);
    } else {
      console.log('\n❌ TEST FAILED: Stats did not update correctly');
      console.log(`   Expected: ${initialSessions + 1}, Got: ${updatedSessions}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testStatsUpdate();
