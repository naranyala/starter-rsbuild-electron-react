// Renderer use-cases barrel export
// Central export point for all renderer process use-cases

// Export types from parent types directory
export type { ContentSection, UseCase, WindowConfig, WindowTheme } from '../types';

// Export renderer registry
export { useCaseRegistry } from './renderer-registry';

import { electronArchitectureUseCase } from './electron-architecture';
import { electronDevelopmentUseCase } from './electron-development';
// Import all use-cases
import { electronIntroUseCase } from './electron-intro';
import { electronNativeApisUseCase } from './electron-native-apis';
import { electronPackagingUseCase } from './electron-packaging';
import { electronPerformanceUseCase } from './electron-performance';
import { electronSecurityUseCase } from './electron-security';
import { electronVersionsUseCase } from './electron-versions';
import { useCaseRegistry } from './renderer-registry';

// Register all use-cases
useCaseRegistry.register(electronIntroUseCase);
useCaseRegistry.register(electronArchitectureUseCase);
useCaseRegistry.register(electronSecurityUseCase);
useCaseRegistry.register(electronPackagingUseCase);
useCaseRegistry.register(electronNativeApisUseCase);
useCaseRegistry.register(electronPerformanceUseCase);
useCaseRegistry.register(electronDevelopmentUseCase);
useCaseRegistry.register(electronVersionsUseCase);

// Export individual use-cases
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
export const allElectronUseCases = [
  electronIntroUseCase,
  electronArchitectureUseCase,
  electronSecurityUseCase,
  electronPackagingUseCase,
  electronNativeApisUseCase,
  electronPerformanceUseCase,
  electronDevelopmentUseCase,
  electronVersionsUseCase,
];

// Export window factory functions
export { createWindowFromMenuItem } from './window-factory';
