/// <reference types="bun" />

import { describe, expect, it } from 'bun:test';
import {
  IPC_CHANNELS,
  type IpcChannel,
  type IpcRequest,
  type IpcResponse,
} from '../../src/shared/types/ipc-channels';

describe('IPC Channels - Types', () => {
  describe('IpcChannel type', () => {
    it('should accept valid channel strings', () => {
      const channel: IpcChannel = 'fs:read-file';
      expect(channel).toBe('fs:read-file');
    });

    it('should accept window channels', () => {
      const channel: IpcChannel = 'window:create';
      expect(channel).toBe('window:create');
    });
  });

  describe('IpcResponse type', () => {
    it('should create successful response', () => {
      const response: IpcResponse<string> = {
        success: true,
        data: 'test data',
      };
      expect(response.success).toBe(true);
      expect(response.data).toBe('test data');
    });

    it('should create error response', () => {
      const response: IpcResponse = {
        success: false,
        error: 'Error occurred',
        code: 'ENOENT',
      };
      expect(response.success).toBe(false);
      expect(response.error).toBe('Error occurred');
    });
  });

  describe('IPC_CHANNELS constants', () => {
    it('should have all file system channels', () => {
      expect(IPC_CHANNELS.FS_READ_FILE).toBe('fs:read-file');
      expect(IPC_CHANNELS.FS_WRITE_FILE).toBe('fs:write-file');
      expect(IPC_CHANNELS.FS_DELETE_FILE).toBe('fs:delete-file');
      expect(IPC_CHANNELS.FS_LIST_FILES).toBe('fs:list-files');
    });

    it('should have all window channels', () => {
      expect(IPC_CHANNELS.WINDOW_CREATE).toBe('window:create');
      expect(IPC_CHANNELS.WINDOW_CLOSE).toBe('window:close');
      expect(IPC_CHANNELS.WINDOW_MINIMIZE).toBe('window:minimize');
      expect(IPC_CHANNELS.WINDOW_MAXIMIZE).toBe('window:maximize');
    });

    it('should have all app channels', () => {
      expect(IPC_CHANNELS.APP_QUIT).toBe('app:quit');
      expect(IPC_CHANNELS.APP_RELAUNCH).toBe('app:relaunch');
      expect(IPC_CHANNELS.APP_HIDE).toBe('app:hide');
    });

    it('should have all event channels', () => {
      expect(IPC_CHANNELS.EVENT_SUBSCRIBE).toBe('event:subscribe');
      expect(IPC_CHANNELS.EVENT_EMIT).toBe('event:emit');
    });

    it('should have all log channels', () => {
      expect(IPC_CHANNELS.LOG_WRITE).toBe('log:write');
      expect(IPC_CHANNELS.LOG_GET_PATH).toBe('log:getPath');
    });
  });
});
