import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportClientError } from "@/lib/error-reporter";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (state: { error: Error; reset: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function reportBoundaryError(error: Error, info: ErrorInfo): void {
  reportClientError({
    message: error.message || String(error),
    stack: error.stack,
    componentStack: info.componentStack ?? undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  });
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof console !== "undefined") {
      console.error("ErrorBoundary caught an error:", error, info);
    }
    reportBoundaryError(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  reload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback({ error, reset: this.reset });
    }

    const isDev = import.meta.env.DEV;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              The page hit an unexpected error. Our team has been notified. Try
              reloading — if it keeps happening, please send us feedback.
            </p>
          </div>
          {isDev ? (
            <pre className="text-left text-xs bg-muted text-muted-foreground p-3 rounded-md overflow-auto max-h-48 whitespace-pre-wrap">
              {error.message}
              {error.stack ? `\n\n${error.stack}` : ""}
            </pre>
          ) : null}
          <div className="flex justify-center">
            <Button onClick={this.reload} className="gap-2" data-testid="button-error-reload">
              <RefreshCw className="w-4 h-4" />
              Reload page
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
