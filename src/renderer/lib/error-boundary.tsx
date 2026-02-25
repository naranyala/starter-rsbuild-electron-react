import React, { useCallback, useEffect } from 'react';

interface ErrorInfo {
  componentStack?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export function sendToMainProcess(
  level: 'error' | 'warn' | 'info',
  data: { message: string; stack?: string; source?: string }
): void {
  const channel = level === 'error' ? 'log-error' : level === 'warn' ? 'log-warn' : 'log-info';

  const win = window as unknown as {
    electronAPI?: { send?: (ch: string, d: typeof data) => void };
  };
  if (win.electronAPI?.send) {
    win.electronAPI.send(channel, data);
  } else {
    console[level](`[Renderer:${data.source || 'unknown'}]`, data.message);
  }
}

export function setupRendererErrorHandlers(): void {
  window.onerror = (message, source, lineno, colno, error) => {
    const errorData = {
      message: String(message),
      stack: error?.stack,
      source: source || 'window.onerror',
    };

    console.error('[Renderer Error]', errorData.message);
    if (errorData.stack) {
      console.error('[Renderer Stack]', errorData.stack);
    }

    sendToMainProcess('error', errorData);
    return false;
  };

  window.onunhandledrejection = (event) => {
    const reason = event.reason;
    const errorData = {
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
      source: 'unhandledRejection',
    };

    console.error('[Renderer Unhandled Rejection]', errorData.message);
    if (errorData.stack) {
      console.error('[Renderer Stack]', errorData.stack);
    }

    sendToMainProcess('error', errorData);
  };

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const hasError = args.some(
      (arg) => arg instanceof Error || (typeof arg === 'object' && arg !== null && 'message' in arg)
    );

    if (hasError) {
      const errorData = {
        message: args
          .map((arg) => {
            if (arg instanceof Error) return arg.message;
            if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
            return String(arg);
          })
          .join(' '),
        stack: args.find((arg) => arg instanceof Error)?.stack,
        source: 'console.error',
      };

      sendToMainProcess('error', errorData);
    }

    originalConsoleError.apply(console, args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const errorData = {
      message: args
        .map((arg) => {
          if (arg instanceof Error) return arg.message;
          if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
          return String(arg);
        })
        .join(' '),
      source: 'console.warn',
    };

    sendToMainProcess('warn', errorData);
    originalConsoleWarn.apply(console, args);
  };
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error.message);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    sendToMainProcess('error', {
      message: error.message,
      stack: error.stack,
      source: 'React.ErrorBoundary',
    });

    this.setState({ errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{ padding: '20px', color: '#ff4444', background: '#1a1a1a', minHeight: '100vh' }}
        >
          <h1>Something went wrong</h1>
          <pre style={{ background: '#333', padding: '10px', overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          {this.state.error?.stack && (
            <pre
              style={{ background: '#333', padding: '10px', overflow: 'auto', fontSize: '12px' }}
            >
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export function useErrorHandler(): {
  handleError: (error: Error | string) => void;
} {
  const handleError = useCallback((error: Error | string) => {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    console.error('[useErrorHandler]', message);
    sendToMainProcess('error', { message, stack, source: 'useErrorHandler' });
  }, []);

  return { handleError };
}
