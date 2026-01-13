#!/usr/bin/env node

/**
 * Test script for Feature #38: Stats tab shows today's focus time
 *
 * This script simulates completing 3 work sessions and verifies that:
 * 1. Today's sessions count is correct
 * 2. Today's focus time is calculated correctly
 */

const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testStatsFocusTime() {
  console.log('🧪 Testing Feature #38: Stats tab shows today\'s focus time\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Navigate to the app
    console.log('📱 Opening app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await sleep(1000);

    // Clear existing stats first
    console.log('🧹 Clearing existing stats...');
    await page.evaluate(() => {
      localStorage.removeItem('pomodoro_stats');
      localStorage.removeItem('pomodoro_pending_sessions');
    });
    await sleep(500);

    // Reload to start fresh
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(1000);

    // Navigate to Stats tab to verify initial state
    console.log('📊 Navigating to Stats tab...');
    await page.click('[aria-label="Stats"]');
    await sleep(1000);

    // Check initial state
    const initialState = await page.evaluate(() => {
      const statsText = document.body.innerText;
      return {
        hasTodaySessions: statsText.includes("Today's Sessions"),
        hasFocusTime: statsText.includes('Focus Time Today'),
        todaySessionsValue: statsText.match(/Today's Sessions\s*(\d+)/)?.[1] || '0',
        focusTimeValue: statsText.match(/Focus Time Today\s*(\d+[hm]\s*\d*[hm]?|\d+m)/)?.[1] || '0m',
      };
    });

    console.log('✅ Initial State:');
    console.log(`   - Today's Sessions: ${initialState.todaySessionsValue}`);
    console.log(`   - Focus Time Today: ${initialState.focusTimeValue}`);

    if (initialState.todaySessionsValue !== '0') {
      throw new Error(`Expected 0 sessions, got ${initialState.todaySessionsValue}`);
    }

    // Simulate completing 3 work sessions (25 minutes each = 1500 seconds)
    console.log('\n⏱️  Simulating 3 work sessions (25 min each = 75 min total)...');

    await page.evaluate(() => {
      const today = new Date().toISOString().split('T')[0];
      const now = Date.now();

      const testSessions = [
        {
          timestamp: now - 7200000, // 2 hours ago
          type: 'work',
          duration: 1500, // 25 minutes in seconds
          completed: true
        },
        {
          timestamp: now - 3600000, // 1 hour ago
          type: 'work',
          duration: 1500,
          completed: true
        },
        {
          timestamp: now - 1800000, // 30 minutes ago
          type: 'work',
          duration: 1500,
          completed: true
        }
      ];

      // Get existing stats
      const existingStats = JSON.parse(localStorage.getItem('pomodoro_stats') || '{}');

      // Update stats with test sessions
      const newSessionsByDate = existingStats.sessionsByDate || {};
      newSessionsByDate[today] = (newSessionsByDate[today] || 0) + 3;

      const newSessionHistory = existingStats.sessionHistory || [];
      testSessions.forEach(session => {
        newSessionHistory.push(session);
      });

      const updatedStats = {
        totalSessions: (existingStats.totalSessions || 0) + 3,
        totalMinutes: (existingStats.totalMinutes || 0) + 75, // 3 * 25 minutes
        currentStreak: existingStats.currentStreak || 1,
        bestStreak: Math.max(existingStats.bestStreak || 0, 1),
        sessionsByDate: newSessionsByDate,
        sessionHistory: newSessionHistory
      };

      localStorage.setItem('pomodoro_stats', JSON.stringify(updatedStats));
    });

    await sleep(500);

    // Reload to see updated stats
    console.log('🔄 Reloading to see updated stats...');
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(1000);

    // Navigate to Stats tab again
    await page.click('[aria-label="Stats"]');
    await sleep(1000);

    // Check updated state
    const updatedState = await page.evaluate(() => {
      const statsText = document.body.innerText;
      return {
        todaySessionsValue: statsText.match(/Today's Sessions\s*(\d+)/)?.[1] || '0',
        focusTimeValue: statsText.match(/Focus Time Today\s*(\d+[hm]\s*\d*[hm]?|\d+m)/)?.[1] || '0m',
      };
    });

    console.log('\n✅ Updated State:');
    console.log(`   - Today's Sessions: ${updatedState.todaySessionsValue}`);
    console.log(`   - Focus Time Today: ${updatedState.focusTimeValue}`);

    // Verify results
    console.log('\n🔍 Verifying results...');

    const tests = [
      {
        name: "Today's Sessions shows 3",
        pass: updatedState.todaySessionsValue === '3',
        expected: '3',
        actual: updatedState.todaySessionsValue
      },
      {
        name: 'Focus Time Today shows 1h 15m',
        pass: updatedState.focusTimeValue === '1h 15m',
        expected: '1h 15m',
        actual: updatedState.focusTimeValue
      }
    ];

    let allPassed = true;
    tests.forEach(test => {
      const status = test.pass ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
      if (!test.pass) {
        console.log(`   Expected: ${test.expected}`);
        console.log(`   Actual: ${test.actual}`);
        allPassed = false;
      }
    });

    // Check for console errors
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    consoleErrors.forEach(error => {
      console.log(`⚠️  Console Error: ${error}`);
    });

    if (consoleErrors.length > 0) {
      console.log('\n❌ Console errors detected!');
      allPassed = false;
    }

    if (allPassed) {
      console.log('\n✅ All tests passed! Feature #38 is working correctly.');
    } else {
      console.log('\n❌ Some tests failed. Please review the results above.');
      process.exit(1);
    }

    // Take a screenshot
    await page.screenshot({
      path: 'tests/screenshots/feature_38_stats_focus_time.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved to tests/screenshots/feature_38_stats_focus_time.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testStatsFocusTime().catch(console.error);
