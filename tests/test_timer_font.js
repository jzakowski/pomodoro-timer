#!/usr/bin/env node

/**
 * Test script to verify timer monospace font implementation
 * Tests:
 * 1. Timer displays with large monospace font (80px desktop, 48px mobile)
 * 2. Font is monospace (font-mono class)
 * 3. Numbers have fixed width (tabular-nums class)
 * 4. Timer displays correctly (25:00 format)
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('🧪 Testing Timer Monospace Font Implementation\n');

    // Test 1: Check for font-mono class
    const hasFontMono = data.includes('font-mono');
    console.log(`✓ Test 1: Font is monospace (font-mono class): ${hasFontMono ? 'PASS' : 'FAIL'}`);

    // Test 2: Check for tabular-nums class (fixed width numbers)
    const hasTabularNums = data.includes('tabular-nums');
    console.log(`✓ Test 2: Numbers have fixed width (tabular-nums): ${hasTabularNums ? 'PASS' : 'FAIL'}`);

    // Test 3: Check for 80px font size (desktop)
    const has80px = data.includes('text-[80px]');
    console.log(`✓ Test 3: Desktop font size is 80px: ${has80px ? 'PASS' : 'FAIL'}`);

    // Test 4: Check for responsive 96px font size (larger desktop)
    const has96px = data.includes('text-[96px]');
    console.log(`✓ Test 4: Large desktop font size is 96px: ${has96px ? 'PASS' : 'FAIL'}`);

    // Test 5: Check timer displays 25:00
    const hasTimerDisplay = data.includes('25:00');
    console.log(`✓ Test 5: Timer displays 25:00 format: ${hasTimerDisplay ? 'PASS' : 'FAIL'}`);

    // Test 6: Check for bold font weight
    const hasBold = data.includes('font-bold');
    console.log(`✓ Test 6: Font weight is bold: ${hasBold ? 'PASS' : 'FAIL'}`);

    // Summary
    const allPassed = hasFontMono && hasTabularNums && has80px && has96px && hasTimerDisplay && hasBold;
    console.log('\n' + '='.repeat(50));
    console.log(`Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('='.repeat(50));

    process.exit(allPassed ? 0 : 1);
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
  process.exit(1);
});

req.end();
