import { type ServiceToken, TYPES } from './tokens';

export type ServiceFactory<T> = (container: Container) => T;
export { TYPES };

export interface ServiceDescriptor<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
}

export class Container {
  private services = new Map<ServiceToken, ServiceDescriptor<unknown>>();
  private instances = new Map<ServiceToken, unknown>();
  private parent?: Container;

  constructor(parent?: Container) {
    this.parent = parent;
  }

  register<T>(token: ServiceToken, factory: ServiceFactory<T>, singleton = true): this {
    this.services.set(token, { factory, singleton });
    return this;
  }

  registerInstance<T>(token: ServiceToken, instance: T): this {
    this.services.set(token, {
      factory: () => instance,
      singleton: true,
    });
    this.instances.set(token, instance);
    return this;
  }

  resolve<T>(token: ServiceToken): T {
    const descriptor = this.services.get(token);
    if (!descriptor) {
      if (this.parent) {
        return this.parent.resolve<T>(token);
      }
      throw new Error(`Service not found: ${String(token)}`);
    }

    if (descriptor.singleton) {
      const existing = this.instances.get(token);
      if (existing !== undefined) {
        return existing as T;
      }
      const instance = descriptor.factory(this) as T;
      this.instances.set(token, instance);
      return instance;
    }

    return descriptor.factory(this) as T;
  }

  has(token: ServiceToken): boolean {
    return this.services.has(token) || (this.parent?.has(token) ?? false);
  }

  createScope(): Container {
    return new Container(this);
  }
}

let _container: Container | undefined;

export function getContainer(): Container {
  if (!_container) {
    _container = new Container();
  }
  return _container;
}

export function setContainer(container: Container): void {
  _container = container;
}
