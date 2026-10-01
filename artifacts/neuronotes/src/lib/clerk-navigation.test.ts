import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

const calls: Array<{ method: string; url: string }> = [];
const events: string[] = [];
const origin = "https://example.test";

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    location: {
      origin,
      href: `${origin}/neuronotes/sign-in`,
      assign: (url: string) => calls.push({ method: "assign", url }),
      replace: (url: string) => calls.push({ method: "replace", url }),
    },
  },
});
Object.defineProperty(globalThis, "history", {
  configurable: true,
  value: {
    pushState: (_state: unknown, _title: string, url: string) =>
      calls.push({ method: "pushState", url }),
    replaceState: (_state: unknown, _title: string, url: string) =>
      calls.push({ method: "replaceState", url }),
  },
});
Object.defineProperty(globalThis, "dispatchEvent", {
  configurable: true,
  value: (event: Event) => {
    events.push(event.type);
    return true;
  },
});

// Import after installing the browser stubs: Wouter patches History API
// methods once, emitting the events its mounted router listens for.
const { createClerkNavigation } = await import("./clerk-navigation.ts");

beforeEach(() => {
  calls.length = 0;
  events.length = 0;
});

test("verification push stays in the SPA and notifies Wouter without reload", () => {
  const { routerPush } = createClerkNavigation("/");
  routerPush("/sign-in/factor-two");
  assert.deepEqual(calls, [{ method: "pushState", url: "/sign-in/factor-two" }]);
  assert.deepEqual(events, ["pushState"]);
});

test("prefixed verification paths retain the base exactly once, query and hash", () => {
  const { routerPush } = createClerkNavigation("/neuronotes/");
  routerPush("/neuronotes/sign-in/factor-two?redirect_url=%2Fdashboard#verify");
  assert.deepEqual(calls, [{
    method: "pushState",
    url: "/neuronotes/sign-in/factor-two?redirect_url=%2Fdashboard#verify",
  }]);
});

test("same-origin absolute URLs use SPA navigation", () => {
  createClerkNavigation("/neuronotes").routerPush(`${origin}/neuronotes/sign-up`);
  assert.deepEqual(calls, [{ method: "pushState", url: "/neuronotes/sign-up" }]);
});

test("replace uses replaceState and notifies Wouter", () => {
  createClerkNavigation("/neuronotes").routerReplace("/neuronotes/welcome");
  assert.deepEqual(calls, [{ method: "replaceState", url: "/neuronotes/welcome" }]);
  assert.deepEqual(events, ["replaceState"]);
});

test("external OAuth redirects retain full browser navigation", () => {
  createClerkNavigation("/").routerPush("https://accounts.example.test/oauth");
  assert.deepEqual(calls, [{ method: "assign", url: "https://accounts.example.test/oauth" }]);
  assert.deepEqual(events, []);
});

test("sibling artifacts and lookalike base prefixes are not swallowed", () => {
  const { routerPush, routerReplace } = createClerkNavigation("/neuronotes");
  routerPush("/mobile");
  routerReplace("/neuronotes-other/sign-in");
  assert.deepEqual(calls, [
    { method: "assign", url: `${origin}/mobile` },
    { method: "replace", url: `${origin}/neuronotes-other/sign-in` },
  ]);
  assert.deepEqual(events, []);
});