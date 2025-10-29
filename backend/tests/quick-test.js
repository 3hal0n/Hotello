#!/usr/bin/env node

/**
 * Quick Test Script for Hotello Backend
 * Run this after server is started to verify all fixes are working
 */

const https = require('https');

const BASE_URL = 'http://localhost:5000';

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    log(`\nTesting: ${name}`, 'blue');
    log(`GET ${url}`, 'yellow');

    const startTime = Date.now();
    
    http.get(url, (res) => {
      const duration = Date.now() - startTime;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const passed = res.statusCode === expectedStatus;
        const status = passed ? 'green' : 'red';
        
        log(`Status: ${res.statusCode} (expected ${expectedStatus}) - ${duration}ms`, status);
        
        if (passed) {
          log('✓ PASSED', 'green');
        } else {
          log('✗ FAILED', 'red');
          console.log('Response:', data.substring(0, 200));
        }
        
        resolve(passed);
      });
    }).on('error', (err) => {
      log(`✗ FAILED: ${err.message}`, 'red');
      resolve(false);
    });
  });
}

async function runTests() {
  log('\n========================================', 'blue');
  log('Hotello Backend Test Suite', 'blue');
  log('========================================\n', 'blue');

  const tests = [
    { name: 'Server Health Check', path: '/api/hotels', status: 200 },
    { name: 'Get All Hotels', path: '/api/hotels', status: 200 },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(test.name, test.path, test.status);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  log('\n========================================', 'blue');
  log('Test Results', 'blue');
  log('========================================', 'blue');
  log(`Total: ${passed + failed}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log('========================================\n', 'blue');

  if (failed === 0) {
    log('🎉 All tests passed!', 'green');
  } else {
    log('⚠️  Some tests failed. Check the logs above.', 'red');
  }
}

// Check if server is running
const http = require('http');
log('Checking if server is running...', 'yellow');

http.get(BASE_URL, (res) => {
  log('✓ Server is running!', 'green');
  runTests();
}).on('error', (err) => {
  log('✗ Server is not running!', 'red');
  log('Please start the server with: npm run dev', 'yellow');
  process.exit(1);
});
