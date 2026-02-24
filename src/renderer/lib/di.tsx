import { createContext, useContext } from 'react';

export type ServiceFactory<T> = () => T;

export interface ServiceDescriptor<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
}

export class Container {
  private services = new Map<string, ServiceDescriptor<unknown>>();
  private instances = new Map<string, unknown>();

  register<T>(token: string, factory: ServiceFactory<T>, singleton = true): this {
    this.services.set(token, { factory, singleton });
    return this;
  }

  registerInstance<T>(token: string, instance: T): this {
    this.services.set(token, { factory: () => instance, singleton: true });
    this.instances.set(token, instance);
    return this;
  }

  resolve<T>(token: string): T {
    const descriptor = this.services.get(token);
    if (!descriptor) {
      throw new Error(`Service not found: ${token}`);
    }

    if (descriptor.singleton) {
      const existing = this.instances.get(token);
      if (existing !== undefined) {
        return existing as T;
      }
      const instance = descriptor.factory() as T;
      this.instances.set(token, instance);
      return instance;
    }

    return descriptor.factory() as T;
  }

  has(token: string): boolean {
    return this.services.has(token);
  }
}

export const RENDERER_TYPES = {
  LOGGER: 'logger',
  API: 'api',
  STORAGE: 'storage',
} as const;

interface ContainerContextValue {
  container: Container;
}

const ContainerContext = createContext<ContainerContextValue | null>(null);

interface ProviderProps {
  container: Container;
  children: React.ReactNode;
}

export function DIProvider({ container, children }: ProviderProps) {
  return <ContainerContext.Provider value={{ container }}>{children}</ContainerContext.Provider>;
}

export function useContainer(): Container {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error('useContainer must be used within DIProvider');
  }
  return context.container;
}

export function useService<T>(token: string): T {
  const container = useContainer();
  return container.resolve<T>(token);
}
