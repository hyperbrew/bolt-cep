import { defineConfig } from "vite";
import rollup from "rollup";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";
import usePluginImport from "vite-plugin-importer";

import builtins from "rollup-plugin-node-builtins";
// import replace from '@rollup/plugin-replace';
import nodeResolve from "@rollup/plugin-node-resolve";
import copyNode from "rollup-plugin-node-copy";

import commonjs from "@rollup/plugin-commonjs";

import scss from "rollup-plugin-scss";
import image from "@rollup/plugin-image";

import { cep, jsxInclude } from "./vite-cep-plugin/index.js";
import cepConfig from "./cep.config.json";
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
    // commonjs({
    //   include: /node_modules/,
    // }),
    react({
      // fastRefresh: true,
      // babel: {
      //   // exclude: /node_modules/,
      //   babelrc: false,
      //   // babelHelpers: "runtime",
      //   presets: [
      //     [
      //       "env",
      //       {
      //         targets: {
      //           chrome: "80",
      //         },
      //       },
      //     ],
      //     // [
      //     //   "@babel/preset-env",
      //     //   {
      //     //     useBuiltIns: "entry",
      //     //   },
      //     // ],
      //     "@babel/preset-react",
      //     "@babel/preset-typescript",
      //   ],
      //   plugins: [
      //     // "react-require",
      //     //   "@babel/plugin-syntax-dynamic-import",
      //     //   "@babel/plugin-proposal-class-properties",
      //     //   [
      //     //     "@babel/plugin-proposal-object-rest-spread",
      //     //     {
      //     //       useBuiltIns: true,
      //     //     },
      //     //   ],
      //     //   [
      //     //     "@babel/plugin-transform-runtime",
      //     //     {
      //     //       helpers: true,
      //     //       regenerator: true,
      //     //       useESModules: false,
      //     //     },
      //     //   ],
      //   ],
      // },
    }),
    cep({
      cepConfig: cepConfig,
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
  root,

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
    target: "chrome88",
    outDir,
  },
});

console.log("rollup es3 build");
const outPathExtendscript = path.join("dist", "cep", "jsx", "index.js");
extendscriptConfig(
  `src/jsx/index.ts`,
  outPathExtendscript,
  cepConfig,
  extensions,
  isProduction
);
