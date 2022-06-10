import { defineConfig } from "vite";

import react from "@vitejs/plugin-react"; // BOLT-CEP_REACT-ONLY
import vue from "@vitejs/plugin-vue"; // BOLT-CEP_VUE-ONLY
import { svelte } from "@sveltejs/vite-plugin-svelte"; // BOLT-CEP_SVELTE-ONLY

import type { Plugin } from "rollup"

import { cep, runAction } from "vite-cep-plugin";
import cepConfig from "./cep.config";
import path from "path";
import glob from "glob"
import { extendscriptConfig } from "./vite.es.config";

const extensions = [".js", ".ts", ".tsx"];

const devDist = "dist";
const cepDist = "cep";

const src = path.resolve(__dirname, "src");
const root = path.resolve(src, "js");
const outDir = path.resolve(__dirname, "dist", "cep");

const debugReact = process.env.DEBUG_REACT === "true";
const isProduction = process.env.NODE_ENV === "production";
const isPackage = process.env.ZXP_PACKAGE === "true";
const isServe = process.env.SERVE_PANEL === "true";
const action = process.env.ACTION;

let input = {};
cepConfig.panels.map((panel) => {
  input[panel.name] = path.resolve(root, panel.mainPath);
});

const config = {
  cepConfig,
  isProduction,
  isPackage,
  isServe,
  debugReact,
  dir: `${__dirname}/${devDist}`,
  cepDist: cepDist,
  zxpDir: `${__dirname}/${devDist}/zxp`,
  packages: cepConfig.installModules || [],
};

if (action) {
  runAction(config, action);
  process.exit();
}

// https://vitejs.dev/config/
const watcher = (globs: string[]): Plugin => ({
  name: 'additional-file-watcher',
  buildStart() {
    globs.forEach((globItem) => {
      glob.sync(path.resolve(globItem)).forEach((filename: string) => {
        this.addWatchFile(filename)
      })
    })
  },
})

export default defineConfig({
  plugins: [
    react(), // BOLT-CEP_REACT-ONLY
    vue(), // BOLT-CEP_VUE-ONLY
    svelte(), // BOLT-CEP_SVELTE-ONLY
    cep(config),
  ],
  root,
  clearScreen: false,
  server: {
    port: cepConfig.port,
  },
  preview: {
    port: cepConfig.servePort,
  },

  build: {
    sourcemap: isPackage ? cepConfig.zxp.sourceMap : cepConfig.build?.sourceMap,
    watch: {
      include: "src/jsx/**",
    },
    // commonjsOptions: {
    //   transformMixedEsModules: true,
    // },
    rollupOptions: {
      input,
      output: {
        manualChunks: {},
        // esModule: false,
        preserveModules: false,
        format: "cjs",
      },
      plugins: [
        watcher(["src/jsx/**"]),
      ],
    },
    target: "chrome74",
    outDir,
  },
});

// rollup es3 build
const outPathExtendscript = path.join("dist", "cep", "jsx", "index.js");
extendscriptConfig(
  `src/jsx/index.ts`,
  outPathExtendscript,
  cepConfig,
  extensions,
  isProduction,
  isPackage
);
