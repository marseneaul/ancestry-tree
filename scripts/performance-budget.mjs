import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));
const budgets = {
  jsBytes: 560 * 1024,
  cssBytes: 100 * 1024,
  totalAssetBytes: 55 * 1024 * 1024
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

const files = await walk(distDir);
const assetStats = await Promise.all(
  files.map(async file => ({ file, size: (await stat(file)).size }))
);

const jsBytes = assetStats
  .filter(({ file }) => file.endsWith(".js"))
  .reduce((sum, { size }) => sum + size, 0);
const cssBytes = assetStats
  .filter(({ file }) => file.endsWith(".css"))
  .reduce((sum, { size }) => sum + size, 0);
const totalAssetBytes = assetStats.reduce((sum, { size }) => sum + size, 0);

const results = [
  ["JavaScript", jsBytes, budgets.jsBytes],
  ["CSS", cssBytes, budgets.cssBytes],
  ["Total dist", totalAssetBytes, budgets.totalAssetBytes]
];

let failed = false;
for (const [label, actual, budget] of results) {
  const ok = actual <= budget;
  failed = failed || !ok;
  console.log(`${ok ? "OK" : "OVER"} ${label}: ${formatBytes(actual)} / ${formatBytes(budget)}`);
}

if (failed) {
  process.exitCode = 1;
}
