// Build: server bundle (dist/server.js + dist/client/site.css) and client bundle
// (dist/client/client.js). `node scripts/build.mjs --watch` rebuilds on change.
import * as esbuild from "esbuild";
import { rmSync, mkdirSync, existsSync, renameSync } from "node:fs";
import path from "node:path";

const watch = process.argv.includes("--watch");
const root = process.cwd();
const dist = path.join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(path.join(dist, "client"), { recursive: true });

const common = {
  bundle: true,
  sourcemap: true,
  logLevel: "info",
  loader: { ".module.css": "local-css", ".css": "css" },
  tsconfig: path.join(root, "tsconfig.json"),
  define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production") },
  jsx: "automatic",
};

const server = await esbuild.context({
  ...common,
  entryPoints: [path.join(root, "src/server/http.ts")],
  outfile: path.join(dist, "server.js"),
  platform: "node",
  format: "esm",
  target: "node22",
  packages: "external",
  // The server bundle emits the CSS for every page and component it imports;
  // that file is the stylesheet the HTML links to.
  banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' },
});

const client = await esbuild.context({
  ...common,
  entryPoints: [path.join(root, "src/server/client-entry.tsx")],
  outfile: path.join(dist, "client/client.js"),
  platform: "browser",
  format: "esm",
  target: ["es2022"],
  minify: !watch,
});

async function moveServerCss() {
  const from = path.join(dist, "server.css");
  if (existsSync(from)) renameSync(from, path.join(dist, "client/site.css"));
  const map = path.join(dist, "server.css.map");
  if (existsSync(map)) renameSync(map, path.join(dist, "client/site.css.map"));
}

if (watch) {
  await server.watch();
  await client.watch();
  // esbuild's watch rebuilds in place; poll to move the CSS after each rebuild.
  setInterval(moveServerCss, 500);
  console.log("watching…");
} else {
  await server.rebuild();
  await client.rebuild();
  await moveServerCss();
  await server.dispose();
  await client.dispose();
}
