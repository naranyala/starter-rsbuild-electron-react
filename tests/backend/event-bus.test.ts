/// <reference types="bun" />

import { describe, expect, it } from 'bun:test';
import {
  EVENT_IPC_CHANNELS,
  type EventCallback,
  type EventHandlerOptions,
  type EventType,
  type IEvent,
} from '../../src/shared/types/event-bus';

describe('Event Bus Types', () => {
  describe('EventType', () => {
    it('should accept string event types', () => {
      const eventType: EventType = 'user:login';
      expect(eventType).toBe('user:login');
    });
  });

  describe('EventCallback', () => {
    it('should define callback function type', () => {
      const callback: EventCallback<string> = (data) => {
        expect(data).toBe('test');
      };
      callback('test');
    });
  });

  describe('IEvent interface', () => {
    it('should create event with required fields', () => {
      const event: IEvent = {
        type: 'app:start',
      };
      expect(event.type).toBe('app:start');
    });

    it('should create event with optional fields', () => {
      const event: IEvent = {
        type: 'user:action',
        data: { id: 1, name: 'Test' },
        timestamp: Date.now(),
        source: 'renderer',
      };
      expect(event.type).toBe('user:action');
      expect(event.data).toEqual({ id: 1, name: 'Test' });
      expect(event.source).toBe('renderer');
    });
  });

  describe('EventHandlerOptions', () => {
    it('should allow once option', () => {
      const options: EventHandlerOptions = { once: true };
      expect(options.once).toBe(true);
    });

    it('should allow priority option', () => {
      const options: EventHandlerOptions = { priority: 10 };
      expect(options.priority).toBe(10);
    });
  });

  describe('EVENT_IPC_CHANNELS constants', () => {
    it('should have subscribe channel', () => {
      expect(EVENT_IPC_CHANNELS.subscribe).toBe('event:subscribe');
    });

    it('should have unsubscribe channel', () => {
      expect(EVENT_IPC_CHANNELS.unsubscribe).toBe('event:unsubscribe');
    });

    it('should have emit channel', () => {
      expect(EVENT_IPC_CHANNELS.emit).toBe('event:emit');
    });

    it('should have emitToRenderer channel', () => {
      expect(EVENT_IPC_CHANNELS.emitToRenderer).toBe('event:emit-to-renderer');
    });

    it('should have received channel', () => {
      expect(EVENT_IPC_CHANNELS.received).toBe('event:received');
    });
  });
});
