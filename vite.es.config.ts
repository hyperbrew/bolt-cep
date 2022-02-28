import fs from "fs";
import { rollup, watch, RollupOptions, OutputOptions } from "rollup";
import { uglify } from "rollup-plugin-uglify";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { jsxInclude, jsxBin } from "vite-cep-plugin";
import { CEP_Config } from "vite-cep-plugin";
import path from "path/posix";

export const extendscriptConfig = (
  extendscriptEntry: string,
  outPath: string,
  cepConfig: CEP_Config,
  extensions: string[],
  isProduction: boolean,
  isPackage: boolean
) => {
  console.log(outPath);
  const config: RollupOptions = {
    input: extendscriptEntry,
    treeshake: false,
    output: {
      file: outPath,
      format: "iife",
      sourcemap: isPackage
        ? cepConfig.zxp.sourceMap
        : cepConfig.build?.sourceMap,
    },
    plugins: [
      uglify({
        compress: {
          passes: 0,
          dead_code: false,
          arguments: false,
          assignments: false,
          booleans: false,
          collapse_vars: false,
          comparisons: false,
          conditionals: false,
          directives: false,
          drop_debugger: false,
          evaluate: false,
          functions: false,
          global_defs: false,
          hoist_props: false,
          if_return: false,
          inline: false,
          join_vars: false,
          keep_fargs: false,
          loops: false,
          negate_iife: false,
          objects: false,
          properties: false,
          pure_funcs: false,
          pure_getters: false,
          reduce_funcs: false,
          reduce_vars: false,
          sequences: false,
          side_effects: false,
          strings: false,
          switches: false,
          top_retain: false,
          typeofs: false,
        },
        output: {
          comments: false,
          beautify: true,
        },
      }),
      nodeResolve({
        extensions,
      }),
      babel({
        extensions,
        exclude: /node_modules/,
        babelrc: false,
        babelHelpers: "bundled",
        presets: ["@babel/preset-env", "@babel/preset-typescript"],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-proposal-class-properties",
        ],
      }),
      replace({
        "Object.freeze": "",
        preventAssignment: true,
        sourceMap: isPackage
          ? cepConfig.zxp.sourceMap
          : cepConfig.build?.sourceMap,
      }),
      jsxInclude(),
      jsxBin(isPackage ? cepConfig.zxp.jsxBin : cepConfig.build?.jsxBin),
    ],
  };

  async function build() {
    const bundle = await rollup(config);
    await bundle.write(config.output as OutputOptions);
    await bundle.close();
  }

  const triggerHMR = () => {
    // No built-in way to trigger Vite's HMR reload from outside the root folder
    // Workaround will read and save index.html file for each panel to triggger reload
    console.log("ExtendScript Change");
    cepConfig.panels.map((panel) => {
      const tmpPath = path.join(process.cwd(), "src", "js", panel.mainPath);
      if (fs.existsSync(tmpPath)) {
        const txt = fs.readFileSync(tmpPath, { encoding: "utf-8" });
        fs.writeFileSync(tmpPath, txt, { encoding: "utf-8" });
      }
    });
  };

  const watchRollup = async () => {
    const watcher = watch(config);
    watcher.on("event", ({ result }: any) => {
      if (result) {
        triggerHMR();
        result.close();
      }
    });
    watcher.close();
  };

  if (isProduction) {
    build();
  } else {
    watchRollup();
  }
};
