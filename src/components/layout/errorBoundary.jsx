/**
 * ErrorBoundary.jsx
 * React class-based error boundary.
 * Catches JS errors in child component trees and shows a graceful fallback
 * instead of a blank white screen.
 */

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message ?? 'Unknown error' };
  }

  componentDidCatch(error, info) {
    // In production you'd send this to Sentry / Datadog here.
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">⚠️</div>
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__message">{this.state.errorMessage}</p>
          <button
            className="error-boundary__btn"
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
