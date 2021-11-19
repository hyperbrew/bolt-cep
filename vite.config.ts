import { defineConfig } from "vite";
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

import { cep, jsxInclude, customFunction } from "./rollup-cep-plugin/index.js";
import cepConfig from "./cep.config.json";

const extensions = [".js", ".ts", ".tsx"];

const cepVars = {
  devDist: "dist",
  siteDist: "cep",
  cepDist: "cep",
  isProd: true,
  isPackage: false,
  isLocal: true,
  debugReact: false,
};

function vitePlug() {
  const output = {
    name: "vite-plug",
    handleHotUpdate({ server }) {
      console.log("HOT UPDATE");
    },
  };
  return output;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vitePlug(),
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
  build: {
    watch: {},
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // esModule: false,
        // preserveModules: false,
        format: "iife",
      },
    },
    target: "chrome88",
    outDir: "dist/cep",
  },
});

// TODO: use transformIndexHtml https://vitejs.dev/guide/api-plugin.html#transformindexhtml
