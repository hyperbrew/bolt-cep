import os from "os";
import path from "path";

import copyN, { copyModules, unique } from "./copy-node";

import fs from "fs-extra";
const prettifyXml = require("prettify-xml");

import { log, conColors, posix, resetLog } from "./lib/lib";
import { signZXP } from "./lib/zxp";
import { manifestTemplate } from "./templates/manifest-template";
import { debugTemplate } from "./templates/debug-template";
import { devHtmlTemplate } from "./templates/dev-html-template";
import { htmlTemplate } from "./templates/html-template";
import { ResolvedConfig } from "vite";
import { menuHtmlTemplate } from "./templates/menu-html-template";
import { CEP_Config } from "./cep-config";
import { nodeBuiltIns } from "./lib/node-built-ins";

const homedir = os.homedir();

const ccGlobalExtensionFolder =
  os.platform() == "win32"
    ? "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions"
    : "/Library/Application Support/Adobe/CEP/extensions/";

const ccLocalExtensionFolder =
  os.platform() == "win32"
    ? path.join(homedir, "/AppData/Roaming/Adobe/CEP/extensions")
    : path.join(homedir, `/Library/Application Support/Adobe/CEP/extensions`);

const makeSymlink = (dist: string, dest: string) => {
  try {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    fs.symlinkSync(dist, dest, "junction");
    return [true, dest];
  } catch (e) {
    return [false, e];
  }
};

const injectRequire = fs.readFileSync(
  path.join(__dirname, "./lib/require-js.js"),
  {
    encoding: "utf-8",
  }
);

let foundPackages = [];

interface CepOptions {
  cepConfig: CEP_Config;
  dir: string;
  isProduction: boolean;
  isPackage: boolean;
  debugReact: boolean;
  isServe: boolean;
  cepDist: string;
  zxpDir: string;
  packages: string[];
}
export const copyNode = copyN;
export const cep = (opts: CepOptions) => {
  const {
    cepConfig,
    dir,
    isProduction,
    isPackage,
    isServe,
    debugReact,
    cepDist,
    zxpDir,
    packages,
  } = opts;

  if (cepConfig && cepConfig.panels && isServe) {
    console.clear();
    console.log(`${conColors.green}CEP Panels Served at:`);
    console.log("");
    cepConfig.panels.map((panel) => {
      const relativePath = panel.mainPath;
      const name = panel.name;
      console.log(
        `${conColors.white}   > ${name}: ${conColors.cyan}http://localhost:${cepConfig.servePort}/${name}/`
      );
    });
    resetLog();
    console.log("");
  }

  return {
    name: "cep",
    transformIndexHtml(code: string, opts) {
      // console.log("HTML Transform");
      const isDev = opts.server !== undefined;
      if (isDev) {
        return code;
      }
      let cssFileNameMatches = code.match(/(href=\".*.css\")/g);
      const cssFileNames =
        cssFileNameMatches &&
        Array.from(cssFileNameMatches).map((file) =>
          file.replace('href="', "").replace('"', "")
        );
      const jsFileNameMatch = code.match(/(src=\".*.js\")/);
      const jsFileName =
        jsFileNameMatch &&
        jsFileNameMatch.pop().replace('src="', "").replace('"', "");

      // TODO: better require transformations
      const jsName = jsFileName.substr(1);

      let newCode = opts.bundle[jsName].code;

      const allRequires = newCode.match(
        /(require\(\"([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,))/g
      );
      if (allRequires) {
        const requireNames = allRequires.map((req: string) =>
          req.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0].replace(/\"/g, "")
        );
        const copyModules = requireNames.filter(
          (name: string) =>
            !nodeBuiltIns.includes(name) && ![".", "/", "\\"].includes(name[0])
        );
        foundPackages = foundPackages.concat(copyModules);
      }

      const matches = newCode.match(
        /(\=require\(\"\.([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,))/g
      );
      matches?.map((match: string) => {
        const jsPath = match.match(/\".*\"/);
        const jsBasename = path.basename(jsPath[0]);
        if (jsPath) {
          newCode = newCode.replace(
            match,
            `=typeof cep_node !== 'undefined'?cep_node.require(cep_node.global["__dir"+"name"] + "/assets/${jsBasename}):require("../assets/${jsBasename});`
          );
        }
      });
      newCode = newCode.replace(`="./assets`, `="../assets`);
      newCode = newCode.replace(`="/assets`, `="../assets`);
      opts.bundle[jsName].code = newCode;

      const sharedBundle = Object.keys(opts.bundle).find(
        (key) => key.includes("jsx-runtime") && key.includes(".js")
      );
      if (sharedBundle && opts.bundle[sharedBundle]) {
        opts.bundle[sharedBundle].code = opts.bundle[sharedBundle].code
          .replace(`="./assets`, `="../assets`)
          .replace(`="/assets`, `="../assets`);
      }

      const html = htmlTemplate({
        ...cepConfig,
        debugReact,
        jsFileName,
        cssFileNames,
        injectRequire,
      });
      return html;
    },
    // configureServer(server, extra) {
    //   console.log(server);
    //   // return extra;
    // },
    configResolved(config: ResolvedConfig) {
      if (!isProduction) {
        console.clear();
        console.log(`${conColors.green}CEP Panels Served at:`);
        console.log("");
        Object.keys(config.build.rollupOptions.input).map((key: string) => {
          const filePath = config.build.rollupOptions.input[key];
          const relativePath = path.relative(config.root, filePath);
          const destPath = path.resolve(config.build.outDir, relativePath);
          const panelHtmlFile = {
            type: "asset",
            source: devHtmlTemplate({
              ...cepConfig,
              url: `http://localhost:${cepConfig.port}/${posix(relativePath)}`,
              injectRequire,
            }),
            name: "CEP HTML Dev File",
            fileName: "index.html",
          };
          fs.writeFileSync(destPath, panelHtmlFile.source);
          console.log(
            `${conColors.white}   > ${path.dirname(relativePath)}: ${
              conColors.cyan
            }http://localhost:${cepConfig.port}/${posix(
              path.dirname(relativePath)
            )}/`
          );
        });
      }
    },
    writeBundle() {
      // console.log(" BUILD END");
      const src = "./";
      const dest = "dist/cep";
      const symlink = false;
      const allPackages = unique(packages.concat(foundPackages));
      copyModules({ packages: allPackages, src, dest, symlink });

      console.log("FINISH");
      if (isPackage) {
        return signZXP(cepConfig, path.join(dir, cepDist), zxpDir);
      }
    },
    async generateBundle(output: any, bundle: any) {
      const jsFileName = Object.keys(bundle).find(
        (key) => key.split(".").pop() === "js"
      );

      // fix paths
      bundle[jsFileName].code = bundle[jsFileName].code.replace(
        /(\/assets\/)/g,
        "./assets/"
      );

      console.log(
        `${conColors.green}cep process: ${
          (isPackage && "zxp package") || (isProduction && "build") || "dev"
        }`
      );

      const manifestFile = {
        type: "asset",
        source: prettifyXml(manifestTemplate(cepConfig), {
          indent: 2,
          newline: "\n",
        }),
        name: "CEP Manifest File",
        fileName: path.join("CSXS", "manifest.xml"),
      };
      //@ts-ignore
      this.emitFile(manifestFile);
      log("manifest created", true);

      // const menuFile = {
      //   type: "asset",
      //   source: menuHtmlTemplate({
      //     displayName: cepConfig.displayName,
      //     menu: cepConfig.panels.map((panel) => {
      //       return {
      //         name: panel.name,
      //         url: panel.mainPath,
      //       };
      //     }),
      //   }),
      //   name: "Menu File",
      //   fileName: path.join("index.html"),
      // };
      //@ts-ignore
      // this.emitFile(menuFile);
      // log("menu created", true);

      const debugFile = {
        type: "asset",

        source: prettifyXml(debugTemplate(cepConfig)),
        name: "CEP Debug File",
        fileName: path.join(".debug"),
      };
      //@ts-ignore
      this.emitFile(debugFile);
      log("debug file created", true);

      try {
        const symlinkPath =
          cepConfig.symlink === "global"
            ? ccGlobalExtensionFolder
            : ccLocalExtensionFolder;
        const res = makeSymlink(
          path.join(dir, cepDist),

          path.join(symlinkPath, cepConfig.id)
        );
        if (!res[0]) {
          log("symlink already exists", true);
        } else {
          log("symlink created", true);
        }
      } catch (e) {
        console.warn(e);
      }

      console.log("");
    },
  };
};

export const jsxInclude = (opts = {}) => {
  const foundIncludes: string[] = [];
  return {
    name: "extendscript-include-resolver",
    generateBundle: (output: any, bundle: any) => {
      const esFile = Object.keys(bundle).pop();
      bundle[esFile].code = [...foundIncludes, bundle[esFile].code].join("\r");
    },
    transform: (code: string, id: string) => {
      const matches = code.match(/^\/\/(\s|)\@include(.*)/g);
      if (matches) {
        matches.map((match: string) => {
          const innerMatches = match.match(/(?:'|").*(?:'|")/);
          const firstMatch = innerMatches?.pop();
          if (firstMatch) {
            const relativeDir = firstMatch.replace(/(\"|\')/g, "");
            const filePath = path.join(path.dirname(id), relativeDir);
            if (fs.existsSync(filePath)) {
              const text = fs.readFileSync(filePath, { encoding: "utf-8" });
              foundIncludes.push(text);
            } else {
              console.warn(
                `WARNING: File cannot be found for include ${match}`
              );
            }
            code = code.replace(match, "");
          }
        });
      }
      return code;
    },
  };
};
