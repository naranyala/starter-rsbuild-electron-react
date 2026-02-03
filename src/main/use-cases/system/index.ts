/**
 * System management use-cases for backend
 */

import { PerformanceUtils, SystemUtils } from '../../lib/main-utils';

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  electronVersion: string;
  memory: NodeJS.MemoryUsage;
  cpu: ReturnType<typeof SystemUtils.getCpuInfo>;
  uptime: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

/**
 * Get comprehensive system information
 */
export const getSystemInfoUseCase = {
  id: 'system.get-info',

  async execute(): Promise<SystemInfo> {
    return {
      platform: SystemUtils.getPlatform(),
      arch: process.arch,
      nodeVersion: SystemUtils.getNodeVersion(),
      electronVersion: SystemUtils.getElectronVersion(),
      memory: PerformanceUtils.getMemoryUsage(),
      cpu: SystemUtils.getCpuInfo(),
      uptime: SystemUtils.getUptime(),
    };
  },
};

/**
 * Execute system command with safety checks
 */
export const executeCommandUseCase = {
  id: 'system.execute-command',

  async execute(
    command: string,
    options?: {
      timeout?: number;
      allowedCommands?: string[];
    }
  ): Promise<CommandResult> {
    // Security check - only allow whitelisted commands
    if (options?.allowedCommands) {
      const isAllowed = options.allowedCommands.some((allowed) =>
        command.trim().startsWith(allowed)
      );

      if (!isAllowed) {
        throw new Error(`Command not allowed: ${command}`);
      }
    }

    return SystemUtils.execCommand(command, {
      timeout: options?.timeout || 30000,
    });
  },
};

/**
 * Monitor system resources
 */
export const monitorResourcesUseCase = {
  id: 'system.monitor-resources',

  async execute(intervalMs = 1000): Promise<{
    start: () => void;
    stop: () => void;
    getStats: () => Promise<SystemInfo>;
  }> {
    let interval: NodeJS.Timeout | null = null;
    let stats: SystemInfo | null = null;

    const collect = async () => {
      stats = await getSystemInfoUseCase.execute();
    };

    return {
      start: () => {
        if (!interval) {
          interval = setInterval(collect, intervalMs);
        }
      },
      stop: () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      getStats: () => (stats ? Promise.resolve(stats) : getSystemInfoUseCase.execute()),
    };
  },
};
