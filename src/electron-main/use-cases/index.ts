// Electron-main use-cases barrel export
// Central export point for all main process use-cases

export * from './ipc-integration';
export * from './registry';
export * from './types';

import { electronArchitectureMainUseCase } from './electron-architecture';
import { electronDevelopmentMainUseCase } from './electron-development';
import { electronIntroMainUseCase } from './electron-intro';
import { electronNativeApisMainUseCase } from './electron-native-apis';
import { electronPackagingMainUseCase } from './electron-packaging';
import { electronPerformanceMainUseCase } from './electron-performance';
import { electronSecurityMainUseCase } from './electron-security';
import { electronVersionsMainUseCase } from './electron-versions';
// Import all use-cases
import { electronUseCaseRegistry } from './registry';

// Register all use-cases
electronUseCaseRegistry.register(electronIntroMainUseCase);
electronUseCaseRegistry.register(electronArchitectureMainUseCase);
electronUseCaseRegistry.register(electronSecurityMainUseCase);
electronUseCaseRegistry.register(electronPackagingMainUseCase);
electronUseCaseRegistry.register(electronNativeApisMainUseCase);
electronUseCaseRegistry.register(electronPerformanceMainUseCase);
electronUseCaseRegistry.register(electronDevelopmentMainUseCase);
electronUseCaseRegistry.register(electronVersionsMainUseCase);

// Export individual use-cases
export {
  electronIntroMainUseCase,
  electronArchitectureMainUseCase,
  electronSecurityMainUseCase,
  electronPackagingMainUseCase,
  electronNativeApisMainUseCase,
  electronPerformanceMainUseCase,
  electronDevelopmentMainUseCase,
  electronVersionsMainUseCase,
};

// Export array of all use-cases
export const allElectronUseCases = [
  electronIntroMainUseCase,
  electronArchitectureMainUseCase,
  electronSecurityMainUseCase,
  electronPackagingMainUseCase,
  electronNativeApisMainUseCase,
  electronPerformanceMainUseCase,
  electronDevelopmentMainUseCase,
  electronVersionsMainUseCase,
];
