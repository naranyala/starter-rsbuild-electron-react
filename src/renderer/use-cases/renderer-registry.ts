// Renderer-side use-case registry
// Manages UI use-cases for window creation and content generation

import type { UseCase } from '../types';

class UseCaseRegistry {
  private registry = new Map<string, UseCase>();

  register(useCase: UseCase): void {
    if (this.registry.has(useCase.metadata.id)) {
      console.warn(
        `[renderer] Use-case "${useCase.metadata.id}" is already registered. Overwriting.`
      );
    }
    this.registry.set(useCase.metadata.id, useCase);
  }

  unregister(id: string): boolean {
    return this.registry.delete(id);
  }

  get(id: string): UseCase | undefined {
    return this.registry.get(id);
  }

  getAll(): UseCase[] {
    return Array.from(this.registry.values());
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  clear(): void {
    this.registry.clear();
  }
}

export const useCaseRegistry = new UseCaseRegistry();
export type { UseCaseRegistry };
