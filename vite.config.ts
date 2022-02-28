import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { cep } from "vite-cep-plugin";
import cepConfig from "./cep.config";
import path from "path";
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
      isProduction,
      isPackage,
      isServe,
      debugReact,
      dir: `${__dirname}/${devDist}`,
      cepDist: cepDist,
      zxpDir: `${__dirname}/${devDist}/zxp`,
      packages: cepConfig.installModules || [],
    }),
  ],
  root,
  clearScreen: false,
  server: {
    port: isProduction ? cepConfig.servePort : cepConfig.port,
  },

  build: {
    // emptyOutDir: true,
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
