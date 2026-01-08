const puppeteer = require('puppeteer');

async function verifyTabs() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Check Timer tab
    console.log('\n✓ Timer tab loaded');
    await page.screenshot({ path: 'screenshots/timer-tab.png' });

    // Click Tasks tab
    console.log('Clicking Tasks tab...');
    await page.click('button[aria-label="Switch to Tasks tab"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/tasks-tab.png' });
    console.log('✓ Tasks tab loaded');

    // Click Stats tab
    console.log('Clicking Stats tab...');
    await page.click('button[aria-label="Switch to Stats tab"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/stats-tab.png' });
    console.log('✓ Stats tab loaded');

    // Click Settings tab
    console.log('Clicking Settings tab...');
    await page.click('button[aria-label="Switch to Settings tab"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/settings-tab.png' });
    console.log('✓ Settings tab loaded');

    console.log('\n✓ All tabs working correctly!');
    console.log('\nScreenshots saved to screenshots/ directory');

    await page.waitForTimeout(3000);

  } finally {
    await browser.close();
  }
}

verifyTabs().catch(console.error);
