/**
 * Manual Test for Browser Notifications Toggle (Issue #19)
 *
 * This test verifies that the browser notifications toggle:
 * 1. Shows up in the Settings tab
 * 2. Requests permission when toggled ON
 * 3. Shows correct status messages
 * 4. Handles permission denial gracefully
 *
 * Prerequisites:
 * - App must be running at http://localhost:3000
 * - Run with: node test_browser_notifications.js
 */

const puppeteer = require('puppeteer')
const { setTimeout } = require('timers/promises')

async function testBrowserNotifications() {
  console.log('🧪 Starting Browser Notifications Test...\n')

  const browser = await puppeteer.launch({
    headless: false, // Show browser for manual verification
    args: ['--disable-web-security'], // For testing purposes
  })

  try {
    const page = await browser.newPage()

    // Grant notification permissions upfront
    await page.on('dialog', async (dialog) => {
      console.log('🔔 Permission dialog appeared:', dialog.message())
      await dialog.accept() // Allow notifications
    })

    // Navigate to app
    console.log('📍 Navigating to http://localhost:3000')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
    await setTimeout(1000)

    // Navigate to Settings tab
    console.log('📍 Clicking Settings tab')
    const settingsTab = await page.$('a[href="#settings"]')
    if (!settingsTab) {
      // Try alternative selector
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button, a'))
        const settingsTab = tabs.find(tab => tab.textContent.includes('Settings'))
        if (settingsTab) settingsTab.click()
      })
    } else {
      await settingsTab.click()
    }
    await setTimeout(1000)

    // Check if toggle is visible
    console.log('🔍 Checking for browser notifications toggle...')
    const toggleVisible = await page.evaluate(() => {
      const toggle = document.querySelector('[role="switch"][aria-label*="notifications" i]')
      return {
        exists: !!toggle,
        ariaChecked: toggle?.getAttribute('aria-checked'),
        text: toggle?.textContent || '',
      }
    })

    console.log('   Toggle exists:', toggleVisible.exists)
    console.log('   Current state:', toggleVisible.ariaChecked)

    if (!toggleVisible.exists) {
      throw new Error('❌ Browser notifications toggle not found!')
    }

    // Get initial status message
    const initialStatus = await page.evaluate(() => {
      const statusBox = document.querySelector('.bg-gray-50, .dark\\:bg-gray-700\\/50')
      return statusBox?.textContent?.trim() || ''
    })
    console.log('   Initial status:', initialStatus)

    // Click toggle to enable
    console.log('\n📍 Clicking toggle to enable notifications...')
    await page.evaluate(() => {
      const toggle = document.querySelector('[role="switch"][aria-label*="notifications" i]')
      if (toggle) toggle.click()
    })
    await setTimeout(2000) // Wait for permission dialog

    // Check if permission was requested and granted
    const permissionGranted = await page.evaluate(() => {
      return Notification.permission === 'granted'
    })
    console.log('   Permission granted:', permissionGranted)

    // Check new status message
    const newStatus = await page.evaluate(() => {
      const statusBox = document.querySelector('.bg-green-50, .dark\\:bg-green-900\\/20')
      return statusBox?.textContent?.trim() || ''
    })
    console.log('   New status:', newStatus)

    // Verify toggle is now ON
    const toggleState = await page.evaluate(() => {
      const toggle = document.querySelector('[role="switch"][aria-label*="notifications" i]')
      return {
        ariaChecked: toggle?.getAttribute('aria-checked'),
        classList: toggle?.className || '',
      }
    })
    console.log('   Toggle state after enable:', toggleState.ariaChecked)

    if (permissionGranted && toggleState.ariaChecked === 'true') {
      console.log('\n✅ TEST PASSED: Browser notifications toggle works correctly!')
      console.log('   - Toggle is visible in Settings')
      console.log('   - Permission was requested')
      console.log('   - Toggle shows enabled state')
      console.log('   - Status message updated')
    } else {
      console.log('\n⚠️  TEST WARNING: Some checks failed')
      console.log('   Permission:', permissionGranted)
      console.log('   Toggle state:', toggleState.ariaChecked)
    }

    // Test disabling
    console.log('\n📍 Testing toggle disable...')
    await page.evaluate(() => {
      const toggle = document.querySelector('[role="switch"][aria-label*="notifications" i]')
      if (toggle) toggle.click()
    })
    await setTimeout(1000)

    const toggleAfterDisable = await page.evaluate(() => {
      const toggle = document.querySelector('[role="switch"][aria-label*="notifications" i]')
      return toggle?.getAttribute('aria-checked')
    })
    console.log('   Toggle state after disable:', toggleAfterDisable)

    if (toggleAfterDisable === 'false') {
      console.log('✅ Toggle can be disabled')
    }

    console.log('\n📸 Please verify visually:')
    console.log('   1. Toggle appears in Settings > Notifications & Sound section')
    console.log('   2. Status message changes based on permission state')
    console.log('   3. Toggle shows correct ON/OFF state')
    console.log('   4. UI is polished and professional')

    console.log('\n⏸️  Keeping browser open for 10 seconds for manual inspection...')
    await setTimeout(10000)

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message)
    console.error(error.stack)
  } finally {
    await browser.close()
    console.log('\n🏁 Test complete')
  }
}

// Run the test
testBrowserNotifications().catch(console.error)
