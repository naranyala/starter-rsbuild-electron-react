// Performance Optimization - Main process use-case handlers
// Backend handlers for performance monitoring

import type { ElectronUseCase, IpcResponse, UseCaseHandlerContext } from './types';

const metadata = {
  id: 'electron-performance',
  title: 'Performance Optimization',
  category: 'performance',
};

const performanceMetrics: {
  startTime: number;
  measurements: Map<string, number>;
} = {
  startTime: Date.now(),
  measurements: new Map(),
};

const handlers = {
  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-performance:getMetrics': async (): Promise<IpcResponse> => {
    try {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      return {
        success: true,
        data: {
          process: {
            uptime: process.uptime(),
            pid: process.pid,
            startTime: performanceMetrics.startTime,
          },
          memory: {
            rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
            external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
          },
          cpu: {
            user: `${Math.round(cpuUsage.user / 1000)} ms`,
            system: `${Math.round(cpuUsage.system / 1000)} ms`,
          },
          measurements: Object.fromEntries(performanceMetrics.measurements),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get metrics: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-performance:recordMeasurement': async (
    _context: UseCaseHandlerContext,
    name: string,
    value: number
  ): Promise<IpcResponse> => {
    try {
      performanceMetrics.measurements.set(name, value);
      return {
        success: true,
        data: { recorded: true, name, value },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to record measurement: ${(error as Error).message}`,
      };
    }
  },

  // biome-ignore lint/suspicious/noExplicitAny: IPC handler args
  'usecase:electron-performance:clearMeasurements': async (): Promise<IpcResponse> => {
    try {
      performanceMetrics.measurements.clear();
      return {
        success: true,
        data: { cleared: true },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to clear measurements: ${(error as Error).message}`,
      };
    }
  },
};

export const electronPerformanceMainUseCase: ElectronUseCase = {
  id: 'electron-performance',
  metadata,
  handlers,
};

export default electronPerformanceMainUseCase;
