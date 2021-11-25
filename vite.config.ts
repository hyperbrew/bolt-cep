import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { cep } from "./vite-cep-plugin/index.js";
import cepConfig from "./cep.config";
import path from "path";
import { extendscriptConfig } from "./extendscript.config.js";

const extensions = [".js", ".ts", ".tsx"];

const cepVars = {
  devDist: "dist",
  siteDist: "cep",
  cepDist: "cep",
  isProd: true,
  isPackage: false,
  isLocal: true,
  debugReact: process.env.DEBUG_REACT === "true",
};

const src = path.resolve(__dirname, "src");
const root = path.resolve(__dirname, "src", "js");
const outDir = path.resolve(__dirname, "dist", "cep");

const isProduction = process.env.NODE_ENV === "production";

let input = {};
cepConfig.panels.map((panel) => {
  input[panel.name] = path.resolve(root, panel.mainPath);
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cep({
      cepConfig,
      dir: `${__dirname}/${cepVars.devDist}`,
      siteDist: cepVars.siteDist,
      cepDist: cepVars.cepDist,
      zxpDir: `${__dirname}/${cepVars.devDist}/zxp`,
      isProduction: isProduction,
      isPackage: cepVars.isPackage,
      isLocal: cepVars.isLocal,
      debugReact: cepVars.debugReact,
    }),
  ],
  root,
  clearScreen: false,
  server: {
    port: isProduction ? cepConfig.servePort : cepConfig.port,
  },
  build: {
    // emptyOutDir: true,
    watch: {
      include: "src/jsx/**",
    },
    rollupOptions: {
      input,
      output: {
        manualChunks: {},
        // esModule: false,
        preserveModules: false,
        format: "cjs",
      },
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
  isProduction
);
