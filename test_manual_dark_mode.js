/**
 * Simple manual test for dark mode toggle
 */

const { chromium } = require('playwright');

async function testDarkMode() {
  console.log('🌙 Testing dark mode toggle...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const page = await browser.newPage();

  try {
    // Set viewport to desktop size to see desktop navigation
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('1. Loading app...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Try clicking settings button using evaluate
    console.log('\n2. Clicking Settings tab...');
    await page.evaluate(() => {
      // Find all buttons with Settings text
      const buttons = Array.from(document.querySelectorAll('button'));
      const settingsButton = buttons.find(btn =>
        btn.getAttribute('aria-label') === 'Settings' &&
        btn.offsetParent !== null // Check if visible
      );
      if (settingsButton) {
        settingsButton.click();
      }
    });
    await page.waitForTimeout(1000);
    console.log('   ✓ Settings clicked');

    // Check if settings tab is visible
    const settingsVisible = await page.isVisible('text=Choose your preferred color scheme');
    console.log(`   Settings visible: ${settingsVisible}`);

    if (settingsVisible) {
      // Get current theme
      const htmlHasDark = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      console.log(`\n3. Current theme: ${htmlHasDark ? 'DARK' : 'LIGHT'}`);

      // Click Dark button
      console.log('\n4. Clicking Dark mode button...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const darkButton = buttons.find(btn => btn.textContent?.includes('Dark'));
        if (darkButton) {
          darkButton.click();
        }
      });
      await page.waitForTimeout(1000);

      const htmlHasDarkAfterDark = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      console.log(`   Theme after clicking Dark: ${htmlHasDarkAfterDark ? 'DARK' : 'LIGHT'}`);

      if (htmlHasDarkAfterDark) {
        console.log('   ✓ Dark mode activated!');

        // Screenshot
        await page.screenshot({ path: 'screenshots/dark_mode_active.png' });
        console.log('   📸 Screenshot saved: screenshots/dark_mode_active.png');

        // Click Light button
        console.log('\n5. Clicking Light mode button...');
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const lightButton = buttons.find(btn => btn.textContent?.includes('Light'));
          if (lightButton) {
            lightButton.click();
          }
        });
        await page.waitForTimeout(1000);

        const htmlHasDarkAfterLight = await page.evaluate(() => {
          return document.documentElement.classList.contains('dark');
        });
        console.log(`   Theme after clicking Light: ${htmlHasDarkAfterLight ? 'DARK' : 'LIGHT'}`);

        if (!htmlHasDarkAfterLight) {
          console.log('   ✓ Light mode activated!');
          await page.screenshot({ path: 'screenshots/light_mode_active.png' });
          console.log('   📸 Screenshot saved: screenshots/light_mode_active.png');
        } else {
          console.log('   ✗ Light mode did NOT activate');
        }
      } else {
        console.log('   ✗ Dark mode did NOT activate');
      }
    } else {
      console.log('   ✗ Settings tab not visible');
    }

    console.log('\n✅ Test completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testDarkMode().catch(console.error);
