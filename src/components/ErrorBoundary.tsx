import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong.';
      
      try {
        const errorData = JSON.parse(this.state.error?.message || '{}');
        if (errorData.error && errorData.error.includes('Missing or insufficient permissions')) {
          errorMessage = 'You do not have permission to access this data. Please ensure you are logged in correctly.';
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl">
            <h2 className="text-xl font-bold mb-2">Application Error</h2>
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
