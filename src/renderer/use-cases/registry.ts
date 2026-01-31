// Electron-main use-case registry
// Manages backend handlers for use-cases

import type { ElectronUseCase, ElectronUseCaseRegistry } from './types';

class Registry {
  private registry: ElectronUseCaseRegistry = new Map();

  register(useCase: ElectronUseCase): void {
    if (this.registry.has(useCase.id)) {
      console.warn(`[main] Use-case handler "${useCase.id}" is already registered. Overwriting.`);
    }
    this.registry.set(useCase.id, useCase);
    if (useCase.onRegister) {
      useCase.onRegister();
    }
  }

  unregister(id: string): boolean {
    const useCase = this.registry.get(id);
    if (useCase && useCase.onUnregister) {
      useCase.onUnregister();
    }
    return this.registry.delete(id);
  }

  get(id: string): ElectronUseCase | undefined {
    return this.registry.get(id);
  }

  getAll(): ElectronUseCase[] {
    return Array.from(this.registry.values());
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  clear(): void {
    this.registry.forEach((useCase) => {
      if (useCase.onUnregister) {
        useCase.onUnregister();
      }
    });
    this.registry.clear();
  }

  getAllHandlers(): Map<string, ElectronUseCase> {
    return new Map(this.registry);
  }
}

export const electronUseCaseRegistry = new Registry();
export { Registry };
