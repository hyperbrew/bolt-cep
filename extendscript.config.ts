import rollup, { RollupOptions, OutputOptions } from "rollup";
import { uglify } from "rollup-plugin-uglify";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { jsxInclude } from "vite-cep-plugin";
import { CEP_Config } from "vite-cep-plugin/cep-config";

export const extendscriptConfig = (
  extendscriptEntry: string,
  outPath: string,
  cepConfig: CEP_Config,
  extensions: string[],
  isProduction: boolean
) => {
  console.log(outPath);
  const config: RollupOptions = {
    input: extendscriptEntry,
    treeshake: false,
    output: {
      file: outPath,
      format: "iife",
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
      }),
      jsxInclude(),
    ],
  };

  async function build() {
    const bundle = await rollup.rollup(config);
    await bundle.write(config.output as OutputOptions);
    await bundle.close();
  }

  const watch = async () => {
    const watcher = rollup.watch(config);
    watcher.on("event", (event) => {});
    watcher.on("event", ({ result }: any) => {
      if (result) {
        result.close();
      }
    });
    watcher.close();
  };

  if (isProduction) {
    build();
  } else {
    watch();
  }
};
