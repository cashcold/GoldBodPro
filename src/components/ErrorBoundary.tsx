import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught a runtime error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full bg-[#090E18] text-white flex flex-col items-center justify-center p-6 my-4">
          <div className="bg-[#0F172A] border border-amber-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-7 h-7 text-[#FFD700]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {this.props.fallbackTitle || 'Component Encountered an Issue'}
            </h2>
            <p className="text-xs text-gray-400">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload View
              </button>
              <a
                href="/"
                className="btn-outline-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
