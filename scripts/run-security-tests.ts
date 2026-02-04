#!/usr/bin/env node

import { execSync } from 'child_process';
import { Logger, LogLevel } from './utils/logger';
import { ErrorHandler } from './utils/error-handler';

/**
 * Run all security tests in sequence
 */

async function runAllSecurityTests() {
  const tests = [
    'bun test tests/security.test.ts',
    'bun test tests/security-input-validation.test.ts',
    'bun test tests/security-electron.test.ts',
    'bun test tests/security-dependencies.test.ts'
  ];

  Logger.info('Starting all security tests...\n');

  let allPassed = true;

  for (const testCmd of tests) {
    try {
      Logger.info(`Running: ${testCmd}`);
      const result = execSync(testCmd, { encoding: 'utf-8', stdio: 'pipe' });
      Logger.info('✅ PASSED\n');
    } catch (error) {
      Logger.error(`❌ FAILED: ${testCmd}`);
      Logger.error((error as Error).message);
      console.error(((error as any).stderr as string) || '');
      allPassed = false;
    }
  }

  if (allPassed) {
    Logger.info('🎉 All security tests passed!');
    process.exit(0);
  } else {
    Logger.error('💥 Some security tests failed!');
    process.exit(1);
  }
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllSecurityTests().catch(error => {
    ErrorHandler.handleError(error, 'run-all-security-tests');
    process.exit(1);
  });
}