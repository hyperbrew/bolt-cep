import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from '@rollup/plugin-babel'

import { cep, jsxInclude, customFunction } from "./rollup-cep-plugin/index.js";
import cepConfig from "./cep.config.json";

const extensions = ['.js', '.ts', '.tsx'];

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
      babel({
          extensions,
          exclude: /node_modules/,
          babelrc: false,
          babelHelpers: 'runtime',
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          plugins: [
            'react-require',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            [
              '@babel/plugin-proposal-object-rest-spread',
              {
                useBuiltIns: true,
              },
            ],
            [
              '@babel/plugin-transform-runtime',
              {
                helpers: true,
                regenerator: true,
                useESModules: false,
              },
            ],
          ],
        }),
  ],
  build: {
    outDir: "dist/cep",
  },
});
