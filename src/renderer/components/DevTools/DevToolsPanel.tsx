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

export interface IpcMessage {
  id: string;
  timestamp: number;
  direction: 'send' | 'receive';
  channel: string;
  payload?: unknown;
}

interface DevToolsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

type TabId = 'logs' | 'ipc' | 'performance' | 'state';

const MAX_LOGS = 500;
const MAX_IPC = 200;

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350,
    background: '#282a36',
    color: '#f8f8f2',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: 12,
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    borderTop: '2px solid #44475a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: '#21222c',
    borderBottom: '1px solid #44475a',
  },
  title: {
    fontWeight: 'bold',
    color: '#50fa7b',
  },
  toggle: {
    position: 'fixed',
    bottom: 0,
    right: 20,
    background: '#282a36',
    color: '#f8f8f2',
    padding: '6px 12px',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 12,
    zIndex: 9999,
    border: 'none',
  },
  tabs: {
    display: 'flex',
    background: '#21222c',
    borderBottom: '1px solid #44475a',
  },
  tab: {
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: '#6272a4',
    fontSize: 12,
  },
  tabActive: {
    background: '#44475a',
    color: '#50fa7b',
    borderBottom: '2px solid #50fa7b',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 12px',
    background: '#21222c',
    borderBottom: '1px solid #44475a',
  },
  input: {
    background: '#44475a',
    color: '#f8f8f2',
    border: 'none',
    padding: '4px 8px',
    borderRadius: 3,
    fontSize: 12,
    width: 200,
  },
  button: {
    background: '#44475a',
    color: '#f8f8f2',
    border: 'none',
    padding: '4px 8px',
    borderRadius: 3,
    cursor: 'pointer',
    fontSize: 11,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    background: '#282a36',
    padding: 4,
  },
  logRow: {
    display: 'flex',
    gap: 8,
    padding: '2px 4px',
  },
  logTime: {
    color: '#6272a4',
    minWidth: 85,
  },
  logData: {
    color: '#6272a4',
    fontSize: 10,
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  perfGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 12,
    padding: 12,
  },
  perfCard: {
    background: '#44475a',
    padding: 12,
    borderRadius: 4,
    textAlign: 'center' as const,
  },
  perfName: {
    color: '#6272a4',
    fontSize: 11,
    marginBottom: 4,
  },
  perfValue: {
    color: '#50fa7b',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export const DevToolsPanel: React.FC<DevToolsPanelProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<TabId>('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ipcMessages, setIpcMessages] = useState<IpcMessage[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    { name: string; value: number; unit: string }[]
  >([]);
  const [filter, setFilter] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const ipcEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback(
    (level: LogEntry['level'], source: LogEntry['source'], message: string, data?: unknown) => {
      const entry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        level,
        source,
        message,
        data,
      };
      setLogs((prev) => {
        const updated = [...prev, entry];
        if (updated.length > MAX_LOGS) return updated.slice(-MAX_LOGS);
        return updated;
      });
    },
    []
  );

  const addIpcMessage = useCallback(
    (direction: IpcMessage['direction'], channel: string, payload?: unknown) => {
      const entry: IpcMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        direction,
        channel,
        payload,
      };
      setIpcMessages((prev) => {
        const updated = [...prev, entry];
        if (updated.length > MAX_IPC) return updated.slice(-MAX_IPC);
        return updated;
      });
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleError = (event: ErrorEvent) => {
      addLog('error', 'renderer', event.message, {
        filename: event.filename,
        lineno: event.lineno,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addLog('error', 'renderer', `Unhandled rejection: ${event.reason}`, { reason: event.reason });
    };

    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;
    const originalConsoleDebug = console.debug;

    console.error = (...args: unknown[]) => {
      originalConsoleError.apply(console, args);
      const [first, ...rest] = args;
      addLog('error', 'renderer', String(first), rest.length > 0 ? rest : undefined);
    };

    console.warn = (...args: unknown[]) => {
      originalConsoleWarn.apply(console, args);
      const [first, ...rest] = args;
      addLog('warn', 'renderer', String(first), rest.length > 0 ? rest : undefined);
    };

    console.info = (...args: unknown[]) => {
      originalConsoleInfo.apply(console, args);
      const [first, ...rest] = args;
      addLog('info', 'renderer', String(first), rest.length > 0 ? rest : undefined);
    };

    console.debug = (...args: unknown[]) => {
      originalConsoleDebug.apply(console, args);
      const [first, ...rest] = args;
      addLog('debug', 'renderer', String(first), rest.length > 0 ? rest : undefined);
    };

    const api = (
      window as unknown as {
        electronAPI?: { on?: (channel: string, listener: (...args: unknown[]) => void) => void };
      }
    ).electronAPI;
    if (api?.on) {
      api.on('event:received', (...args: unknown[]) => {
        const payload = args[0] as { event: string; data: unknown };
        if (payload?.event) {
          addIpcMessage('receive', payload.event, payload.data);
        }
      });
    }

    const interval = setInterval(() => {
      const mem = (
        performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }
      ).memory;
      setPerformanceMetrics([
        { name: 'Memory Used', value: mem ? mem.usedJSHeapSize / 1048576 : 0, unit: 'MB' },
        { name: 'Memory Total', value: mem ? mem.totalJSHeapSize / 1048576 : 0, unit: 'MB' },
        { name: 'DOM Nodes', value: document.querySelectorAll('*').length, unit: '' },
        { name: 'Logs', value: logs.length, unit: '' },
        { name: 'IPC Msgs', value: ipcMessages.length, unit: '' },
      ]);
    }, 1000);

    addLog('info', 'renderer', 'DevTools panel opened');

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      console.debug = originalConsoleDebug;
      clearInterval(interval);
    };
  }, [isOpen, addLog, addIpcMessage, logs.length, ipcMessages.length]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  useEffect(() => {
    if (autoScroll && ipcEndRef.current) {
      ipcEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ipcMessages, autoScroll]);

  const filteredLogs = filter
    ? logs.filter((log) => log.message.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  const filteredIpc = filter
    ? ipcMessages.filter((msg) => msg.channel.toLowerCase().includes(filter.toLowerCase()))
    : ipcMessages;

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return '#ff5555';
      case 'warn':
        return '#ffb86c';
      case 'info':
        return '#50fa7b';
      case 'debug':
        return '#8be9fd';
    }
  };

  const getSourceColor = (source: LogEntry['source']) => {
    switch (source) {
      case 'main':
        return '#bd93f9';
      case 'renderer':
        return '#50fa7b';
      case 'ipc':
        return '#ffb86c';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleTimeString('en-US', { hour12: false }) +
      '.' +
      String(date.getMilliseconds()).padStart(3, '0')
    );
  };

  const clearLogs = () => setLogs([]);
  const clearIpc = () => setIpcMessages([]);

  if (!isOpen) {
    return (
      <button style={styles.toggle} onClick={onToggle}>
        DevTools
      </button>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>DevTools</div>
        <div>
          <button style={styles.button} onClick={() => setFilter('')}>
            Clear Filter
          </button>
          <button style={{ ...styles.button, marginLeft: 8 }} onClick={onToggle}>
            Close
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        {(['logs', 'ipc', 'performance', 'state'] as TabId[]).map((tab) => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'logs'
              ? `Logs (${logs.length})`
              : tab === 'ipc'
                ? `IPC (${ipcMessages.length})`
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.toolbar}>
        <input
          style={styles.input}
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <label style={{ color: '#f8f8f2', fontSize: 12 }}>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />{' '}
          Auto-scroll
        </label>
        {activeTab === 'logs' && (
          <button style={styles.button} onClick={clearLogs}>
            Clear
          </button>
        )}
        {activeTab === 'ipc' && (
          <button style={styles.button} onClick={clearIpc}>
            Clear
          </button>
        )}
      </div>

      <div style={styles.content}>
        {activeTab === 'logs' &&
          filteredLogs.map((log) => (
            <div key={log.id} style={styles.logRow}>
              <span style={styles.logTime}>{formatTime(log.timestamp)}</span>
              <span style={{ color: getLevelColor(log.level), minWidth: 50 }}>
                {log.level.toUpperCase()}
              </span>
              <span style={{ color: getSourceColor(log.source), minWidth: 70 }}>
                [{log.source}]
              </span>
              <span style={{ flex: 1, wordBreak: 'break-word' }}>{log.message}</span>
              {log.data ? (
                <span style={styles.logData as React.CSSProperties}>
                  {String(JSON.stringify(log.data))}
                </span>
              ) : null}
            </div>
          ))}
        {activeTab === 'ipc' &&
          filteredIpc.map((msg) => (
            <div key={msg.id} style={styles.logRow}>
              <span style={styles.logTime}>{formatTime(msg.timestamp)}</span>
              <span style={{ color: msg.direction === 'send' ? '#ff79c6' : '#8be9fd' }}>
                {msg.direction === 'send' ? '→' : '←'}
              </span>
              <span style={{ flex: 1 }}>{msg.channel}</span>
              {msg.payload ? (
                <span style={styles.logData}>{String(JSON.stringify(msg.payload))}</span>
              ) : null}
            </div>
          ))}
        {activeTab === 'ipc' && <div ref={ipcEndRef} />}

        {activeTab === 'performance' && (
          <div style={styles.perfGrid}>
            {performanceMetrics.map((metric, idx) => (
              <div key={idx} style={styles.perfCard}>
                <div style={styles.perfName}>{metric.name}</div>
                <div style={styles.perfValue}>
                  {metric.value.toFixed(1)} {metric.unit}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'state' && (
          <div style={{ padding: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#bd93f9', fontWeight: 'bold', marginBottom: 8 }}>App Info</div>
              <div style={{ background: '#21222c', padding: 8, borderRadius: 4 }}>
                <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
                <div>Platform: {navigator.platform}</div>
                <div>Language: {navigator.language}</div>
                <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
              </div>
            </div>
            <div>
              <div style={{ color: '#bd93f9', fontWeight: 'bold', marginBottom: 8 }}>
                Environment
              </div>
              <div style={{ background: '#21222c', padding: 8, borderRadius: 4 }}>
                <div>Electron: {typeof process !== 'undefined' ? 'Yes' : 'No'}</div>
                <div>Node: {typeof process !== 'undefined' ? process.version : 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevToolsPanel;
