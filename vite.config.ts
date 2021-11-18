import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { cep, jsxInclude, customFunction } from "./rollup-cep-plugin/index.js";
import cepConfig from "./cep.config.json";

const cepVars = {
  devDist: "dist",
  siteDist: "cep",
  cepDist: "cep",
  isProd: true,
  isPackage: false,
  isLocal: true,
  debugReact: false,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cep({
      config: cepConfig,
      dir: `${__dirname}/${cepVars.devDist}`,
      siteDist: cepVars.siteDist,
      cepDist: cepVars.cepDist,
      zxpDir: `${__dirname}/${cepVars.devDist}/zxp`,
      isProduction: cepVars.isProd,
      isPackage: cepVars.isPackage,
      isLocal: cepVars.isLocal,
      debugReact: cepVars.debugReact,
    }),
  ],
  build: {
    outDir: "dist/cep",
  },
});
