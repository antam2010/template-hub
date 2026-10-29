import { readFile, writeFile, mkdir, rm, mkdtemp } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import JSZip from "jszip";
import { tmpdir } from "node:os";
const root = await mkdtemp(resolve(tmpdir(), "hub-consumer-"));
console.log("Isolated consumer:", root);
const zip = await JSZip.loadAsync(
  await readFile("public/distribution/company-members.zip"),
);
for (const [name, entry] of Object.entries(zip.files)) {
  if (entry.dir) continue;
  const path = resolve(root, name);
  if (!path.startsWith(root + "/")) throw Error("Unsafe path");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, await entry.async("nodebuffer"));
}
for (const args of [["install"], ["build"]]) {
  const p = spawnSync("pnpm", args, { cwd: root, stdio: "inherit" });
  if (p.status !== 0) process.exit(p.status ?? 1);
}
// Confirm the same installed, compiled package (no source alias) serves SSR too.
const result = spawnSync(
  "node",
  [
    "--input-type=module",
    "-e",
    `import React from 'react';import{renderToString}from'react-dom/server';import{ListPage}from'@hub/screen-patterns';const html=renderToString(React.createElement(ListPage,{title:'회원 관리',rows:[],columns:[],getKey:r=>r.id,query:'',onQueryChange:()=>{},status:'전체',statuses:['전체'],onStatusChange:()=>{},page:1,totalPages:1,onPageChange:()=>{},onCreate:()=>{}}));if(!html.includes('검색 결과가 없습니다.'))throw Error('Missing empty state');console.log('Installed package SSR passed')`,
  ],
  { cwd: root, stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status ?? 1);

await writeFile(
  resolve(root, "src/policy-violation.tsx"),
  "export const bad = <button>새 버튼</button>;",
);
const rejected = spawnSync("pnpm", ["check:ui"], {
  cwd: root,
  encoding: "utf8",
});
if (rejected.status !== 1 || !rejected.stderr.includes("공통 UI를 사용하세요"))
  throw new Error("Policy did not reject new UI");
console.log("Installed consumer policy rejected unapproved button");
await rm(root, { recursive: true, force: true });
