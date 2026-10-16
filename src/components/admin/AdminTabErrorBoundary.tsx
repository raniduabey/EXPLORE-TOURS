"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminTabErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AdminTabErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm space-y-4 max-w-2xl mx-auto my-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-ceylon-navy">
                {this.props.fallbackTitle || "An unexpected error occurred in this section"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The rest of the admin dashboard remains operational and safe.
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-rose-700 break-words">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Section</span>
            </button>
            {this.props.onReset && (
              <button
                type="button"
                onClick={this.props.onReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-ceylon-navy text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
