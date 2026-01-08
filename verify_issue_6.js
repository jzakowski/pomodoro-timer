// Quick verification script for Issue #6
// Run in browser console at http://localhost:3000

console.log('🧪 Verifying Issue #6: Auto-Session Switching\n');

// 1. Check initial state
const initialMode = document.querySelector('.text-lg.font-medium')?.textContent;
const initialTime = document.querySelector('.text-7xl.font-bold.font-mono')?.textContent;

console.log('1. Initial State:');
console.log('   Mode:', initialMode);
console.log('   Time:', initialTime);

// 2. Find and click skip button (simulates auto-switch)
console.log('\n2. Testing skip button (uses same logic as auto-switch)...');

const skipButton = document.querySelector('button[aria-label="Skip session"]');
if (!skipButton) {
  console.error('❌ Skip button not found!');
} else {
  console.log('   Found skip button');

  // Click 3 times to test the flow
  setTimeout(() => {
    console.log('\n   Click 1: Work → Short Break');
    skipButton.click();

    setTimeout(() => {
      const mode1 = document.querySelector('.text-lg.font-medium')?.textContent;
      const time1 = document.querySelector('.text-7xl.font-bold.font-mono')?.textContent;
      console.log('   Result:', mode1, time1);

      if (mode1 === 'Short Break' && time1 === '05:00') {
        console.log('   ✅ PASS: Switched to Short Break with 05:00');

        setTimeout(() => {
          console.log('\n   Click 2: Short Break → Work');
          skipButton.click();

          setTimeout(() => {
            const mode2 = document.querySelector('.text-lg.font-medium')?.textContent;
            const time2 = document.querySelector('.text-7xl.font-bold.font-mono')?.textContent;
            console.log('   Result:', mode2, time2);

            if (mode2 === 'Work' && time2 === '25:00') {
              console.log('   ✅ PASS: Switched back to Work with 25:00');
              console.log('\n✅ All tests passed!');
            } else {
              console.log('   ❌ FAIL: Expected Work and 25:00');
            }
          }, 500);
        }, 1000);
      } else {
        console.log('   ❌ FAIL: Expected Short Break and 05:00');
      }
    }, 500);
  }, 500);
}

console.log('\n⏳ Test running...');
