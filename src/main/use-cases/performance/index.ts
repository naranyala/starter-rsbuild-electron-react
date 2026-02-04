/**
 * Performance monitoring use-cases for backend
 */

import { LogUtils, PerformanceUtils, SystemUtils } from '../../lib/main-utils';

export interface PerformanceMetrics {
  memory: NodeJS.MemoryUsage;
  cpu: {
    user: number;
    system: number;
  };
  uptime: number;
  timestamp: number;
}

export interface FunctionMeasurement<T> {
  result: T;
  duration: number;
  timestamp: number;
}

/**
 * Get current performance metrics
 */
export const getPerformanceMetricsUseCase = {
  id: 'performance.get-metrics',

  async execute(): Promise<PerformanceMetrics> {
    const [memory, cpu] = await Promise.all([
      Promise.resolve(PerformanceUtils.getMemoryUsage()),
      PerformanceUtils.getCpuUsage(),
    ]);

    return {
      memory,
      cpu,
      uptime: SystemUtils.getUptime(),
      timestamp: Date.now(),
    };
  },
};

/**
 * Measure function execution time
 */
export const measureFunctionUseCase = {
  id: 'performance.measure-function',

  async execute<T>(fn: () => Promise<T> | T, label?: string): Promise<FunctionMeasurement<T>> {
    const { result, duration } = await PerformanceUtils.measureTime(fn, label);

    return {
      result,
      duration,
      timestamp: Date.now(),
    };
  },
};

/**
 * Create performance monitor
 */
export const createMonitorUseCase = {
  id: 'performance.create-monitor',

  async execute(intervalMs = 1000): Promise<{
    start: () => void;
    stop: () => void;
    getStats: () => Promise<PerformanceMetrics>;
  }> {
    const monitor = PerformanceUtils.createMonitor(intervalMs);

    return {
      start: monitor.start,
      stop: monitor.stop,
      getStats: async () => {
        const stats = monitor.getStats();
        return {
          memory: stats.memory,
          cpu: await PerformanceUtils.getCpuUsage(),
          uptime: stats.uptime,
          timestamp: Date.now(),
        };
      },
    };
  },
};

/**
 * Start performance timer
 */
export const startTimerUseCase = {
  id: 'performance.start-timer',

  async execute(label?: string): Promise<() => Promise<number>> {
    const endTimer = PerformanceUtils.startTimer(label || 'timer');

    return async () => {
      const duration = endTimer();
      return duration;
    };
  },
};

/**
 * Monitor memory usage over time
 */
export const monitorMemoryUseCase = {
  id: 'performance.monitor-memory',

  async execute(thresholdMB = 500): Promise<{
    isOverThreshold: boolean;
    currentUsage: number;
    percentage: number;
    recommendation: string;
  }> {
    const memoryUsage = PerformanceUtils.getMemoryUsage();
    const currentUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    const isOverThreshold = currentUsageMB > thresholdMB;

    let recommendation = '';
    if (isOverThreshold) {
      recommendation = `Memory usage is high. Consider optimizing or implementing garbage collection.`;
    } else {
      recommendation = `Memory usage is within acceptable limits.`;
    }

    return {
      isOverThreshold,
      currentUsage: currentUsageMB,
      percentage: (currentUsageMB / thresholdMB) * 100,
      recommendation,
    };
  },
};
