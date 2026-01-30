// Use-case registry for managing window use-cases
// Provides registration, retrieval, and management of modular window components

import type { UseCase, UseCaseMetadata, UseCaseRegistry } from './types';

class Registry {
  private registry: UseCaseRegistry = new Map();

  register(useCase: UseCase): void {
    if (this.registry.has(useCase.metadata.id)) {
      console.warn(`Use-case with id "${useCase.metadata.id}" is already registered. Overwriting.`);
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

  getAllMetadata(): UseCaseMetadata[] {
    return this.getAll().map((useCase) => useCase.metadata);
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  clear(): void {
    this.registry.clear();
  }

  search(query: string): UseCase[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((useCase) => {
      const { title, description, tags, searchableTerms } = useCase.metadata;
      const searchText = [title, description, ...tags, ...(searchableTerms || [])]
        .join(' ')
        .toLowerCase();
      return searchText.includes(lowerQuery);
    });
  }

  fuzzySearch(query: string): UseCase[] {
    if (!query) return this.getAll();

    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((useCase) => {
      const searchText = useCase.metadata.title.toLowerCase();
      let queryIndex = 0;
      for (let i = 0; i < searchText.length; i++) {
        if (queryIndex < lowerQuery.length && searchText[i] === lowerQuery[queryIndex]) {
          queryIndex++;
        }
      }
      return queryIndex === lowerQuery.length;
    });
  }

  getByCategory(category: string): UseCase[] {
    return this.getAll().filter((useCase) => useCase.metadata.category === category);
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    this.getAll().forEach((useCase) => categories.add(useCase.metadata.category));
    return Array.from(categories);
  }
}

export const useCaseRegistry = new Registry();
export { Registry };
