import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: '' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || 'No stack trace available'
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#0c0c0c',
          color: '#ffffff',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>
            😢 应用发生错误
          </h1>
          <div style={{
            backgroundColor: '#1c1c1c',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#ffaa44', marginBottom: '10px' }}>错误信息:</h3>
            <pre style={{
              color: '#ff6b6b',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '14px'
            }}>
              {this.state.error?.toString()}
            </pre>
          </div>
          <div style={{
            backgroundColor: '#1c1c1c',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#60cdff', marginBottom: '10px' }}>组件堆栈:</h3>
            <pre style={{
              color: '#999999',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '12px',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              {this.state.errorInfo}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#60cdff',
              color: '#000000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            重新加载应用
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
