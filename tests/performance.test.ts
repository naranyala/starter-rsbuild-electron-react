/// <reference types="bun" />

import { describe, expect, test } from 'bun:test';

describe('Performance Tests', () => {
  test('basic performance test', () => {
    const start = performance.now();
    
    // Simple operation to measure
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      sum += i;
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Performance should be reasonable (under 100ms for this operation)
    expect(duration).toBeLessThan(100);
    expect(sum).toBe(49995000); // Sum of 0 to 9999
  });

  test('memory usage test', () => {
    // Basic memory usage test
    const largeArray = new Array(10000).fill(0).map((_, i) => i);
    expect(largeArray.length).toBe(10000);
    
    // Clean up
    largeArray.length = 0;
    expect(largeArray.length).toBe(0);
  });

  test('async performance test', async () => {
    const start = performance.now();
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const end = performance.now();
    const duration = end - start;
    
    // Should take at least 10ms but not much more
    expect(duration).toBeGreaterThanOrEqual(10);
    expect(duration).toBeLessThan(50);
  });
});