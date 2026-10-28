import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import JSZip from "jszip";
for (const file of (await readdir(".generated")).filter((f) =>
  f.endsWith(".zip"),
)) {
  const zip = await JSZip.loadAsync(await readFile(`.generated/${file}`));
  const root = resolve(".generated/extracted");
  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const path = resolve(root, name);
    if (!path.startsWith(root + "/")) throw new Error("Unsafe archive path");
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, await entry.async("nodebuffer"));
  }
  const cwd = resolve(root, file.replace(/\.zip$/, ""));
  for (const args of [
    ["install"],
    ["build"],
    ...(file.includes("minimal") ? [] : [["test"]]),
  ]) {
    const result = spawnSync("pnpm", args, { cwd, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
  console.log(`VERIFIED ${file}`);
}
