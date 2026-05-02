#!/usr/bin/env node
// Auto-discovers and runs every test/**/*.test.ts suite sequentially.
//
// Filter usage:
//   pnpm --filter @workspace/api-server test                 → runs every suite
//   pnpm --filter @workspace/api-server test healthz         → runs only suites
//                                                              whose discovered
//                                                              name contains
//                                                              "healthz" (case-
//                                                              insensitive)
//   TEST_FILTER=healthz pnpm --filter @workspace/api-server test
//                                                            → same as above,
//                                                              via env var
// Multiple positional args are OR'd together. If no suites match the filter,
// the runner prints a clear error and exits non-zero.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readdir } from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const testDir = path.join(projectRoot, "test");

async function discoverSuites() {
  let entries;
  try {
    entries = await readdir(testDir, { withFileTypes: true, recursive: true });
  } catch (err) {
    if (err && err.code === "ENOENT") return [];
    throw err;
  }
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".test.ts"))
    .map((e) => {
      const dir = e.parentPath ?? e.path ?? testDir;
      return path.join(dir, e.name);
    });
  files.sort();
  return files.map((absPath) => {
    const relFromProject = path.relative(projectRoot, absPath);
    const relFromTestDir = path.relative(testDir, absPath);
    const name = relFromTestDir.replace(/\.test\.ts$/, "").replace(/[\\/]/g, "/");
    return { name, file: relFromProject };
  });
}

function collectFilters() {
  const filters = [];
  for (const arg of process.argv.slice(2)) {
    if (arg && arg.trim()) filters.push(arg.trim());
  }
  const envFilter = process.env.TEST_FILTER;
  if (envFilter && envFilter.trim()) filters.push(envFilter.trim());
  return filters;
}

function applyFilters(suites, filters) {
  if (filters.length === 0) return suites;
  const needles = filters.map((f) => f.toLowerCase());
  return suites.filter((s) => {
    const haystack = s.name.toLowerCase();
    return needles.some((n) => haystack.includes(n));
  });
}

function runSuite(suite) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn("pnpm", ["exec", "tsx", suite.file], {
      cwd: projectRoot,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code, signal) => {
      const durationMs = Date.now() - start;
      const exitCode = code ?? (signal ? 1 : 1);
      resolve({ ...suite, exitCode, durationMs });
    });
    child.on("error", (err) => {
      const durationMs = Date.now() - start;
      console.error(`\n[run-tests] Failed to spawn suite "${suite.name}": ${err.message}`);
      resolve({ ...suite, exitCode: 1, durationMs });
    });
  });
}

function header(text) {
  const bar = "=".repeat(Math.max(8, text.length + 4));
  return `\n${bar}\n  ${text}\n${bar}`;
}

const allSuites = await discoverSuites();

if (allSuites.length === 0) {
  console.log("[run-tests] No test files found under test/**/*.test.ts");
  process.exit(0);
}

const filters = collectFilters();
const suites = applyFilters(allSuites, filters);

if (filters.length > 0 && suites.length === 0) {
  console.error(
    `[run-tests] No suites matched filter(s): ${filters.map((f) => JSON.stringify(f)).join(", ")}`,
  );
  console.error(`[run-tests] Available suites:`);
  for (const s of allSuites) console.error(`  - ${s.name}  (${s.file})`);
  process.exit(1);
}

if (filters.length > 0) {
  console.log(
    `[run-tests] Filter(s) active: ${filters.map((f) => JSON.stringify(f)).join(", ")} → ${suites.length}/${allSuites.length} suite(s) selected:`,
  );
} else {
  console.log(`[run-tests] Discovered ${suites.length} suite(s):`);
}
for (const s of suites) console.log(`  - ${s.name}  (${s.file})`);

const results = [];
for (const suite of suites) {
  console.log(header(`Running suite: ${suite.name}  (${suite.file})`));
  const result = await runSuite(suite);
  results.push(result);
  const status = result.exitCode === 0 ? "PASS" : `FAIL (exit ${result.exitCode})`;
  console.log(`\n[run-tests] Suite "${suite.name}" → ${status} in ${result.durationMs}ms`);
}

console.log(header("Test summary"));
const pad = Math.max(...results.map((r) => r.name.length));
for (const r of results) {
  const status = r.exitCode === 0 ? "PASS" : `FAIL (exit ${r.exitCode})`;
  console.log(`  ${r.name.padEnd(pad)}  ${status}  ${r.durationMs}ms`);
}

const failed = results.filter((r) => r.exitCode !== 0);
const total = results.length;
const passed = total - failed.length;
console.log(`\n  ${passed}/${total} suites passed${failed.length ? `, ${failed.length} failed` : ""}.`);

process.exit(failed.length === 0 ? 0 : 1);
