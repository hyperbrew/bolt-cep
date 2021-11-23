import rollup, { RollupOptions, OutputOptions } from "rollup";
import { uglify } from "rollup-plugin-uglify";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { jsxInclude } from "./vite-cep-plugin";
import path from "path";

export const extendscriptConfig = (
  extendscriptEntry: string,
  outPath: string,
  cepConfig: any,
  extensions: string[],
  isProduction: boolean
) => {
  console.log(outPath);
  const config: RollupOptions = {
    input: extendscriptEntry,
    treeshake: false,
    output: {
      // file: path.join(fullSitePath, "jsx", "index.js"),
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
      // TODO: MAKE JSXINCLUDE WORK WITH JSON AGAIN!!!
      // jsxInclude(),
      // jsxInclude(),
    ],
  };

  async function build() {
    console.log("BUILD EXTENDSCRIPT");
    const bundle = await rollup.rollup(config);
    console.log("watchFiles", bundle.watchFiles); // an array of file names this bundle depends on

    // generate output specific code in-memory
    // you can call this function multiple times on the same bundle object
    // const { output } = await bundle.generate(config.output);

    // for (const chunkOrAsset of output) {
    //   if (chunkOrAsset.type === "asset") {
    //     console.log("Asset", chunkOrAsset);
    //   } else {
    //     console.log("Chunk", chunkOrAsset.modules);
    //   }
    // }

    // or write the bundle to disk

    await bundle.write(config.output as OutputOptions);

    // closes the bundle
    await bundle.close();
  }

  const watch = async () => {
    console.log("WATCH EXTENDSCRIPT");
    const watcher = rollup.watch(config);

    watcher.on("event", (event) => {});

    // This will make sure that bundles are properly closed after each run
    watcher.on("event", ({ result }: any) => {
      if (result) {
        result.close();
      }
    });

    // stop watching
    watcher.close();
  };

  if (isProduction) {
    build();
  } else {
    watch();
  }
};
