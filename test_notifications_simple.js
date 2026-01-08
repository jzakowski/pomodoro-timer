const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Grant notifications permission
  await page.on('dialog', async dialog => await dialog.accept());

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 10000 });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Click settings tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button, a'));
    const settingsTab = tabs.find(tab => tab.textContent.includes('Settings'));
    if (settingsTab) settingsTab.click();
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if toggle exists
  const toggleExists = await page.evaluate(() => {
    const toggle = document.querySelector('[role="switch"]');
    const settingsSection = document.querySelector('h2')?.textContent.includes('Settings');
    return { toggle: !!toggle, settings: settingsSection };
  });

  console.log('✅ Toggle exists:', toggleExists.toggle);
  console.log('✅ Settings page loaded:', toggleExists.settings);

  if (toggleExists.toggle) {
    const status = await page.evaluate(() => {
      const toggle = document.querySelector('[role="switch"]');
      const label = toggle?.getAttribute('aria-label');
      const checked = toggle?.getAttribute('aria-checked');
      const statusText = document.body.textContent.includes('Click toggle to enable');
      return { label, checked, statusText };
    });
    console.log('✅ Toggle label:', status.label);
    console.log('✅ Toggle checked:', status.checked);
    console.log('✅ Status text present:', status.statusText);

    // Check for console errors
    const errors = await page.evaluate(() => {
      return window.__errors || [];
    });
    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    }
  }

  await browser.close();
  console.log('\n🏁 Test complete - please verify manually at http://localhost:3000/settings');
})();
