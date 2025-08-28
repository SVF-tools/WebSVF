import React from 'react';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button onClick={() => (window.location.href = '/')}>Go Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
