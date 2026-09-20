import React from "react";
import {
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(
      "UnderRight frontend error:",
      error,
      info,
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={25} />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-slate-950">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              UnderRight encountered an unexpected interface error.
              Your saved assessment data remains in PostgreSQL.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCcw size={16} />

              Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;