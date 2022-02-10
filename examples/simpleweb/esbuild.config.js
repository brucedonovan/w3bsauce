// #!/usr/bin/env node
import esbuildServe from "esbuild-serve";
// import GlobalsPlugin from "esbuild-plugin-globals";
// import { nodeExternalsPlugin } from 'esbuild-node-externals';

esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["./src/browser.ts"],
    bundle: true,
    outfile: "./dist/browser.js",
    minify: true,
    sourcemap: "external",
    loader: { ".ts": "ts" },
    define: { global: "window" },
    plugins: [],
  },
  {
    port: 3001,
  }
)
  // eslint-disable-next-line no-undef
  .then(() => console.log("⚡ Done"))
  // eslint-disable-next-line no-undef
  .catch(() => process.exit(1));
