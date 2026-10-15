import { lazy, type ComponentType } from "react";

export function isChunkLoadError(error: unknown): boolean {
  return error instanceof Error && /Failed to fetch dynamically imported module|Loading chunk .*failed|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(error.message);
}

export async function retryImport<T>(load: () => Promise<T>, wait = () => new Promise<void>((resolve) => setTimeout(resolve, 750))): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (!isChunkLoadError(error)) throw error;
    await wait();
    return load();
  }
}

export function lazyWithRetry<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() => retryImport(load));
}
