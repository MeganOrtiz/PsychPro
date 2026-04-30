#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const suites = [
  { name: "client-errors-rate-limit", file: "test/clientErrorsRateLimit.test.ts" },
  { name: "client-errors-handler", file: "test/clientErrorsHandler.test.ts" },
  { name: "healthz", file: "test/healthz.test.ts" },
];

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
