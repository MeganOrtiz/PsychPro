#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function header(text) {
  const bar = "=".repeat(Math.max(8, text.length + 4));
  return `\n${bar}\n  ${text}\n${bar}`;
}

function runCmdCapture(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      env: process.env,
      ...opts,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdoutChunks = [];
    const stderrChunks = [];
    child.stdout.on("data", (c) => stdoutChunks.push(c));
    child.stderr.on("data", (c) => stderrChunks.push(c));
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      resolve({
        code: code ?? (signal ? 1 : 1),
        stdout: Buffer.concat(stdoutChunks).toString("utf8"),
        stderr: Buffer.concat(stderrChunks).toString("utf8"),
      });
    });
  });
}

async function listWorkspacePackages() {
  const { code, stdout, stderr } = await runCmdCapture(
    "pnpm",
    ["m", "ls", "--json", "--depth=-1"],
    { cwd: repoRoot },
  );
  if (code !== 0) {
    throw new Error(`'pnpm m ls' failed with exit ${code}:\n${stderr || stdout}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch (err) {
    throw new Error(
      `Failed to parse 'pnpm m ls --json' output: ${err.message}\n--- stdout ---\n${stdout}\n--- stderr ---\n${stderr}`,
    );
  }
  const list = Array.isArray(parsed) ? parsed : [parsed];
  return list.filter((p) => p && p.path && p.path !== repoRoot);
}

async function packageHasTestScript(pkgPath) {
  try {
    const raw = await readFile(path.join(pkgPath, "package.json"), "utf8");
    const json = JSON.parse(raw);
    return Boolean(json && json.scripts && typeof json.scripts.test === "string");
  } catch {
    return false;
  }
}

function runTestForPackage(pkg) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn("pnpm", ["--filter", pkg.name, "run", "test"], {
      cwd: repoRoot,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code, signal) => {
      const durationMs = Date.now() - start;
      const exitCode = code ?? (signal ? 1 : 1);
      resolve({ name: pkg.name, exitCode, durationMs });
    });
    child.on("error", (err) => {
      const durationMs = Date.now() - start;
      console.error(`\n[run-all-tests] Failed to spawn tests for "${pkg.name}": ${err.message}`);
      resolve({ name: pkg.name, exitCode: 1, durationMs });
    });
  });
}

const allPackages = await listWorkspacePackages();
const candidates = [];
for (const pkg of allPackages) {
  if (await packageHasTestScript(pkg.path)) {
    candidates.push(pkg);
  }
}
candidates.sort((a, b) => a.name.localeCompare(b.name));

if (candidates.length === 0) {
  console.log("[run-all-tests] No workspace packages define a 'test' script. Nothing to run.");
  process.exit(0);
}

console.log(
  header(
    `Running 'test' in ${candidates.length} workspace package${candidates.length === 1 ? "" : "s"}`,
  ),
);
for (const pkg of candidates) {
  console.log(`  - ${pkg.name}`);
}

const results = [];
for (const pkg of candidates) {
  console.log(header(`Package: ${pkg.name}`));
  const result = await runTestForPackage(pkg);
  results.push(result);
  const status = result.exitCode === 0 ? "PASS" : `FAIL (exit ${result.exitCode})`;
  console.log(`\n[run-all-tests] ${pkg.name} → ${status} in ${result.durationMs}ms`);
}

console.log(header("Workspace test summary"));
const pad = Math.max(...results.map((r) => r.name.length));
for (const r of results) {
  const status = r.exitCode === 0 ? "PASS" : `FAIL (exit ${r.exitCode})`;
  console.log(`  ${r.name.padEnd(pad)}  ${status}  ${r.durationMs}ms`);
}

const failed = results.filter((r) => r.exitCode !== 0);
const total = results.length;
const passed = total - failed.length;
console.log(
  `\n  ${passed}/${total} package${total === 1 ? "" : "s"} passed${failed.length ? `, ${failed.length} failed` : ""}.`,
);

process.exit(failed.length === 0 ? 0 : 1);
