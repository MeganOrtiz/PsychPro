import { Link } from "wouter";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center study-page-bg p-6"
      data-testid="not-found-page"
    >
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Compass className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            We could not find the page you were looking for. It may have been
            moved, or the link might be out of date.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard">
            <Button data-testid="button-go-dashboard">Back to dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" data-testid="button-go-home">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
