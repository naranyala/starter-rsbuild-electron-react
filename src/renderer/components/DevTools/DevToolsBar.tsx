import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: 'main' | 'renderer' | 'ipc';
  message: string;
  data?: unknown;
}

interface DevToolsBarProps {
  onOpenPanel: () => void;
}

const MAX_LOGS = 50;

const styles: Record<string, React.CSSProperties> = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    background: '#21222c',
    color: '#f8f8f2',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: 11,
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    gap: 16,
    borderTop: '1px solid #44475a',
    cursor: 'pointer',
  },
  button: {
    background: 'transparent',
    border: 'none',
    color: '#6272a4',
    cursor: 'pointer',
    fontSize: 11,
    padding: '2px 6px',
    borderRadius: 2,
  },
  buttonActive: {
    background: '#44475a',
    color: '#50fa7b',
  },
  stats: {
    display: 'flex',
    gap: 16,
    marginLeft: 'auto',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  statError: { color: '#ff5555' },
  statWarn: { color: '#ffb86c' },
  statInfo: { color: '#50fa7b' },
  statIpc: { color: '#bd93f9' },
  logPreview: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
    textOverflow: 'ellipsis',
    maxWidth: '60%',
  },
};

export const DevToolsBar: React.FC<DevToolsBarProps> = ({ onOpenPanel }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [counts, setCounts] = useState({ error: 0, warn: 0, info: 0, ipc: 0 });

  const addLog = useCallback(
    (level: LogEntry['level'], source: LogEntry['source'], message: string) => {
      const entry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        level,
        source,
        message,
      };
      setLogs((prev) => {
        const updated = [...prev, entry];
        if (updated.length > MAX_LOGS) return updated.slice(-MAX_LOGS);
        return updated;
      });
      setCounts((prev) => {
        const key = level === 'debug' ? 'info' : level;
        return { ...prev, [key]: prev[key as keyof typeof prev] + 1 };
      });
    },
    []
  );

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addLog('error', 'renderer', event.message);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addLog('error', 'renderer', `Unhandled rejection: ${event.reason}`);
    };

    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    console.error = (...args: unknown[]) => {
      originalConsoleError.apply(console, args);
      const msg = args.map((a) => String(a)).join(' ');
      addLog('error', 'renderer', msg.slice(0, 100));
    };

    console.warn = (...args: unknown[]) => {
      originalConsoleWarn.apply(console, args);
      const msg = args.map((a) => String(a)).join(' ');
      addLog('warn', 'renderer', msg.slice(0, 100));
    };

    console.info = (...args: unknown[]) => {
      originalConsoleInfo.apply(console, args);
      const msg = args.map((a) => String(a)).join(' ');
      addLog('info', 'renderer', msg.slice(0, 100));
    };

    const api = (
      window as unknown as {
        electronAPI?: { on?: (channel: string, listener: (...args: unknown[]) => void) => void };
      }
    ).electronAPI;
    if (api?.on) {
      api.on('event:received', () => {
        setCounts((prev) => ({ ...prev, ipc: prev.ipc + 1 }));
      });
    }

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, [addLog]);

  const lastLog = logs[logs.length - 1];
  const getLastLogStyle = () => {
    if (!lastLog) return { color: '#6272a4' };
    switch (lastLog.level) {
      case 'error':
        return { color: '#ff5555' };
      case 'warn':
        return { color: '#ffb86c' };
      case 'info':
        return { color: '#50fa7b' };
      default:
        return { color: '#6272a4' };
    }
  };

  return (
    <div style={styles.bar} onClick={onOpenPanel} title="Click to open DevTools panel">
      <span style={{ color: '#50fa7b', fontWeight: 'bold' }}>DevTools</span>
      <span style={{ color: '#6272a4' }}>|</span>

      <button
        style={{ ...styles.button, ...(counts.error > 0 ? styles.buttonActive : {}) }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenPanel();
        }}
      >
        ERR {counts.error}
      </button>
      <button
        style={{ ...styles.button, ...(counts.warn > 0 ? styles.buttonActive : {}) }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenPanel();
        }}
      >
        WARN {counts.warn}
      </button>
      <button
        style={{ ...styles.button, ...(counts.ipc > 0 ? styles.buttonActive : {}) }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenPanel();
        }}
      >
        IPC {counts.ipc}
      </button>

      <span style={styles.logPreview}>
        {lastLog && (
          <>
            <span style={getLastLogStyle()}>[{lastLog.level.toUpperCase()}]</span>
            <span style={{ marginLeft: 8 }}>{lastLog.message}</span>
          </>
        )}
      </span>

      <div style={styles.stats}>
        <span style={styles.stat}>
          Mem:
          {(performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
            ?.usedJSHeapSize
            ? (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory!
                .usedJSHeapSize / 1048576
            : 0}
          MB
        </span>
        <span style={styles.stat}>DOM: {document.querySelectorAll('*').length}</span>
        <span style={{ color: '#6272a4' }}>Click to open</span>
      </div>
    </div>
  );
};

export default DevToolsBar;
