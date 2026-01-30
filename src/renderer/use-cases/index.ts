// Use-cases barrel export
// Central export point for all window use-cases and registry initialization

export * from './registry';
export * from './types';
export * from './window-factory';

import { electronArchitectureUseCase } from './electron-architecture';
import { electronDevelopmentUseCase } from './electron-development';
import { electronIntroUseCase } from './electron-intro';
import { electronNativeApisUseCase } from './electron-native-apis';
import { electronPackagingUseCase } from './electron-packaging';
import { electronPerformanceUseCase } from './electron-performance';
import { electronSecurityUseCase } from './electron-security';
import { electronVersionsUseCase } from './electron-versions';
// Import and register all use-cases
import { useCaseRegistry } from './registry';

// Register all use-cases
useCaseRegistry.register(electronIntroUseCase);
useCaseRegistry.register(electronArchitectureUseCase);
useCaseRegistry.register(electronSecurityUseCase);
useCaseRegistry.register(electronPackagingUseCase);
useCaseRegistry.register(electronNativeApisUseCase);
useCaseRegistry.register(electronPerformanceUseCase);
useCaseRegistry.register(electronDevelopmentUseCase);
useCaseRegistry.register(electronVersionsUseCase);

// Export individual use-cases for direct access
export {
  electronIntroUseCase,
  electronArchitectureUseCase,
  electronSecurityUseCase,
  electronPackagingUseCase,
  electronNativeApisUseCase,
  electronPerformanceUseCase,
  electronDevelopmentUseCase,
  electronVersionsUseCase,
};

// Export array of all use-cases
export const allUseCases = [
  electronIntroUseCase,
  electronArchitectureUseCase,
  electronSecurityUseCase,
  electronPackagingUseCase,
  electronNativeApisUseCase,
  electronPerformanceUseCase,
  electronDevelopmentUseCase,
  electronVersionsUseCase,
];
