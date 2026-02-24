/**
 * Event bus types for shared event handling
 */

export type EventType = string;

export type EventCallback<T = unknown> = (data: T) => void;

export interface IEvent {
  type: EventType;
  data?: unknown;
  timestamp?: number;
  source?: string;
}

export interface IMutableEvent extends IEvent {
  data: unknown;
  preventDefault(): void;
  stopPropagation(): void;
}

export type EventHandler<T = unknown> = (event: IEvent & { data: T }) => void;

export interface EventHandlerOptions {
  once?: boolean;
  priority?: number;
}

export interface EventBusOptions {
  ipcMode?: boolean;
  crossProcess?: boolean;
}

export interface EventStats {
  totalEvents: number;
  eventsByType: Record<EventType, number>;
  avgHandlersPerEvent: number;
}

export interface EventQuery {
  type?: EventType;
  from?: number;
  to?: number;
  source?: string;
  limit?: number;
}

export interface EventBus {
  on<T>(event: EventType, callback: EventCallback<T>, options?: EventHandlerOptions): () => void;
  once<T>(event: EventType, callback: EventCallback<T>): void;
  off(event: EventType, callback?: EventCallback): void;
  emit<T>(event: EventType, data?: T, options?: EmitOptions): void;
  getStats(): EventStats;
  query(query: EventQuery): IEvent[];
}

export interface IEventBus extends EventBus {}

export interface EmitOptions {
  broadcast?: boolean;
  toWindow?: number;
  fromWindow?: number;
}

export interface EventSource {
  id: string;
  type: 'main' | 'renderer';
}

export interface CrossProcessEvent extends IEvent {
  sourceWindow?: number;
  targetWindow?: number;
}

export const EVENT_IPC_CHANNELS = {
  subscribe: 'event:subscribe',
  unsubscribe: 'event:unsubscribe',
  emit: 'event:emit',
  emitToRenderer: 'event:emit-to-renderer',
  received: 'event:received',
} as const;
