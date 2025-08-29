import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 text-white bg-gradient-to-br from-indigo-700 via-cyan-500 to-green-400">
            <div className="w-full max-w-lg bg-red-900/30 backdrop-blur-md border border-red-500/50 rounded-2xl p-8 text-center animate-fade-in-up">
                <AlertTriangleIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-red-200 mb-2">Something Went Wrong</h1>
                <p className="text-red-200/90 mb-6">
                    We've encountered an unexpected error. Please try refreshing the page.
                </p>
                
                {this.state.error?.message && (
                    <div className="text-left text-sm text-red-300 bg-black/20 p-3 rounded-lg font-mono">
                       <p className="font-bold mb-1">Error Details:</p>
                       <p className="break-words">{this.state.error.message}</p>
                    </div>
                )}
                
                {this.state.error?.message.toLowerCase().includes('failed to fetch') && (
                     <p className="text-xs text-yellow-300 mt-4 text-left bg-yellow-900/20 p-3 rounded-lg">
                        <strong>Hint:</strong> "Failed to fetch" errors are often caused by network issues or CORS (Cross-Origin Resource Sharing) policies. Please check your internet connection. If the problem persists, the server may need to be configured to allow requests from this website's domain.
                     </p>
                )}
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
