import { build } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import JSZip from "jszip";
function run(args, cwd = process.cwd()) {
  const p = spawnSync("pnpm", args, { cwd, stdio: "inherit" });
  if (p.status !== 0) throw new Error(args.join(" "));
}
await mkdir("public/distribution", { recursive: true });
for (const name of ["ui-core", "screen-patterns"]) {
  const dir = resolve("packages", name);
  const p = JSON.parse(await readFile(`${dir}/package.json`, "utf8"));
  // Same tokens; omit app-wide font assets and showcase/template utility scanning.
  const entry = `${dir}/src/.package-entry.ts`;
  const css = `${dir}/src/.package-style.css`;
  let code = `export * from './index';`;
  if (name === "ui-core") {
    const tokens = (
      await readFile("packages/design-tokens/src/index.css", "utf8")
    )
      .replace(/^@import "@fontsource[^\n]*\n/m, "")
      .replace(/^@source[^\n]*\n/gm, "")
      .replace('@import "tailwindcss";', '@import "tailwindcss" source(none);');
    await writeFile(css, tokens + '\n@source "./";\n');
    code += `\nimport './.package-style.css';`;
  }
  await writeFile(entry, code);
  try {
    await build({
      configFile: false,
      publicDir: false,
      plugins: [react(), tailwind()],
      build: {
        outDir: `${dir}/dist`,
        emptyOutDir: true,
        lib: {
          entry,
          formats: ["es"],
          fileName: () => "index.js",
          cssFileName: name,
        },
        rollupOptions: {
          external: (id) =>
            Object.keys({ ...p.dependencies, ...p.peerDependencies }).some(
              (dep) => id === dep || id.startsWith(dep + "/"),
            ) || id === "react/jsx-runtime",
        },
      },
    });
  } finally {
    await rm(entry, { force: true });
    await rm(css, { force: true });
  }
  run(["exec", "tsc", "-p", `${dir}/tsconfig.build.json`]);
  run(["pack", "--pack-destination", resolve("public/distribution")], dir);
}
const registry = await readFile("registry/components.json", "utf8");
await writeFile("public/distribution/registry.json", registry);
const zip = new JSZip();
for (const file of [
  "package.json",
  "pnpm-workspace.yaml",
  ".nvmrc",
  ".gitignore",
  "index.html",
  "tsconfig.json",
  "vite.config.ts",
  "AGENTS.md",
  "README.md",
  "ui-policy.json",
  "src/App.tsx",
  "src/main.tsx",
])
  zip.file(file, await readFile(`examples/company-members/${file}`));
zip.file(
  "scripts/check-ui-policy.mjs",
  await readFile("scripts/check-ui-policy.mjs"),
);
zip.file("registry/components.json", registry);
for (const name of ["ui-core", "screen-patterns"])
  zip.file(
    `vendor/hub-${name}-0.1.0.tgz`,
    await readFile(`public/distribution/hub-${name}-0.1.0.tgz`),
  );
await writeFile(
  "public/distribution/company-members.zip",
  await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }),
);
console.log("KIT READY: public/distribution/company-members.zip");
