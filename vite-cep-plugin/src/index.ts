import * as os from "os";
import * as path from "path";

import { Plugin } from "rollup";

import { copyFiles, copyModules, unique } from "./copy-node";

import * as fs from "fs-extra";
const prettifyXml = require("prettify-xml");

// import { requirejs } from "./lib/require-js";

import {
  log,
  conColors,
  posix,
  resetLog,
  fixAssetPathCSS,
  fixAssetPathJS,
  fixAssetPathHTML,
  removeModuleTags,
} from "./lib/lib";
import { signZXP } from "./lib/zxp";
import { manifestTemplate } from "./templates/manifest-template";
import { debugTemplate } from "./templates/debug-template";
import { devHtmlTemplate } from "./templates/dev-html-template";
import type { HtmlTagDescriptor, ResolvedConfig } from "vite";
import { menuHtmlTemplate } from "./templates/menu-html-template";
import { CEP_Config, CEP_Config_Extended, JSXBIN_MODE } from "./cep-config";
// export { CEP_Config } from "./cep-config";
export type { CEP_Config };
import { nodeBuiltIns } from "./lib/node-built-ins";
import MagicString from "magic-string";
import { metaPackage } from "./lib/zip";
import { packageSync } from "./lib/package-sync";

const homedir = os.homedir();
const tmpDir = path.join(__dirname, ".tmp");
fs.ensureDirSync(tmpDir);

const ccGlobalExtensionFolder =
  os.platform() == "win32"
    ? "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions"
    : "/Library/Application Support/Adobe/CEP/extensions/";

const ccLocalExtensionFolder =
  os.platform() == "win32"
    ? path.join(homedir, "/AppData/Roaming/Adobe/CEP/extensions")
    : path.join(homedir, `/Library/Application Support/Adobe/CEP/extensions`);

const removeZeroByteFiles = async (dir: string) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      await removeZeroByteFiles(res);
    } else {
      if ((await fs.stat(res)).size == 0) {
        await fs.unlink(res);
      }
    }
  }
};

const makeSymlink = (dist: string, dest: string) => {
  try {
    if (symlinkExists(dest)) {
      if (path.resolve(fs.readlinkSync(dest)) === path.resolve(dist)) {
        log("symlink already exists", true);
        return "exists";
      } else {
        // incorrect link, remove and re-create
        fs.unlinkSync(dest);
      }
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.symlinkSync(dist, dest, "junction");
    log("symlink created", true);
    return "created";
  } catch (e) {
    console.log(e);
    log("symlink failed. Try running 'sudo yarn symlink'", false);
    return "error";
  }
};

const removeSymlink = (dist: string, dest: string) => {
  try {
    if (symlinkExists(dest)) {
      fs.unlinkSync(dest);
      log("symlink removed successfully", true);
      return "removed";
    } else {
      log("no symlink exists", true);
      return "none";
    }
  } catch (e) {
    log(
      "symlink removal failed. Try removing with 'sudo yarn delsymlink'",
      false
    );
    return "error";
  }
};

const symlinkExists = (dir: string) => {
  let exists, readlink, lstat;
  // try {
  //   exists = fs.existsSync(dir);
  // } catch (e) {}
  // try {
  //   readlink = fs.readlinkSync(dir);
  // } catch (e) {}
  try {
    lstat = fs.lstatSync(dir);
    exists = true;
  } catch (e) {
    exists = false;
  }
  return exists;
};

const injectRequire = fs.readFileSync(
  path.join(__dirname, "./lib/require-js.js"),
  {
    encoding: "utf-8",
  }
);

let foundPackages: string[] = [];

interface CepOptions {
  cepConfig: CEP_Config;
  dir: string;
  isProduction: boolean;
  isPackage: boolean;
  isMetaPackage: boolean;
  debugReact: boolean;
  isServe: boolean;
  cepDist: string;
  zxpDir: string;
  zipDir: string;
  packages: string[];
}
export const cep = (opts: CepOptions) => {
  const {
    cepConfig,
    dir,
    isProduction,
    isPackage,
    isMetaPackage,
    isServe,
    debugReact,
    cepDist,
    zxpDir,
    zipDir,
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
    transformIndexHtml(code: string, opts: any) {
      const browserRequireIgnore: HtmlTagDescriptor = {
        tag: "script",
        children: injectRequire,
      };

      if (opts && opts.bundle) {
        Object.keys(opts.bundle).filter((file) => {
          if (path.extname(file) === ".css") {
            let newCode = opts.bundle[file].source;
            if (newCode) {
              opts.bundle[file].source = fixAssetPathCSS(newCode);
            } else {
              console.log("missing code: ", file);
            }
          }
        });
      }

      // console.log("HTML Transform");
      const isDev = opts.server !== undefined;
      if (isDev) {
        const tags: HtmlTagDescriptor[] = [browserRequireIgnore];
        return tags;
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
        //@ts-ignore
        jsFileNameMatch.pop().replace('src="', "").replace('"', "");

      // TODO: better require transformations
      //@ts-ignore
      const jsName = jsFileName.substr(1);

      let newCode = opts.bundle[jsName].code;

      const allRequires = newCode.match(
        /(require\(\"([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,))/g
      );
      if (allRequires) {
        const requireNames = allRequires.map((req: string) =>
          //@ts-ignore
          req.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0].replace(/\"/g, "")
        );
        const copyModules = requireNames.filter(
          (name: string) =>
            !nodeBuiltIns.includes(name) && ![".", "/", "\\"].includes(name[0])
        );
        foundPackages = foundPackages.concat(copyModules);
      }

      const matches = newCode.match(
        /(require\(\"\.([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,|\)))/g
      );
      // console.log(`REQUIRE USED ${matches?.length} times!`);
      matches?.map((match: string) => {
        const jsPath = match.match(/\".*\"/);
        //@ts-ignore
        const jsBasename = path.basename(jsPath[0]);
        if (jsPath) {
          newCode = newCode.replace(
            match.substring(0, match.length - 1),
            `typeof cep_node !== 'undefined'?cep_node.require(cep_node.global["__dir"+"name"] + "/assets/${jsBasename}):require("../assets/${jsBasename})`
          );
        }
      });
      newCode = newCode.replace(
        `"use strict"`,
        `"use strict";var exports = typeof exports === "undefined" ? {} : exports;`
      );
      opts.bundle[jsName].code = newCode;

      Object.keys(opts.bundle).map((key) => {
        if (path.extname(key) === ".js") {
          let { code, source } = opts.bundle[key];
          if (code && code.replace) {
            opts.bundle[key].code = fixAssetPathJS(code);
          } else if (source && source.replace) {
            opts.bundle[key].source = fixAssetPathJS(source);
          } else {
            console.log("missing code and source: ", opts.bundle[key]);
          }
        }
      });

      const tags: HtmlTagDescriptor[] = [
        browserRequireIgnore,
        {
          tag: "script",
          attrs: { src: `..${jsFileName}` },
          injectTo: "body",
        },
      ];

      code = removeModuleTags(code);
      code = fixAssetPathHTML(code);

      if (debugReact) {
        tags.push({
          tag: "script",
          attrs: { src: "http://localhost:8097" },
          injectTo: "body",
        });
      }

      return {
        tags,
        html: code,
      };
    },

    configResolved(config: ResolvedConfig | any) {
      if (!isProduction) {
        console.clear();
        console.log(`${conColors.green}CEP Panels Served at:`);
        console.log("");
        //@ts-ignore
        Object.keys(config.build.rollupOptions.input).map((key: string) => {
          //@ts-ignore
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
    async writeBundle() {
      // console.log(" BUILD END");
      const root = "./";
      const src = "./src";
      const dest = `dist/${cepDist}`;
      const symlink = false;
      const allPackages = unique(packages.concat(foundPackages));
      copyModules({ packages: allPackages, src: root, dest, symlink });
      if (cepConfig.copyAssets) {
        copyFiles({
          src: path.join(process.cwd(), src),
          dest: path.join(process.cwd(), dest),
          assets: cepConfig.copyAssets,
        });
      }

      const input = path.join(dir, cepDist);
      await removeZeroByteFiles(input);
      if (isPackage) {
        const zxpPath = await signZXP(cepConfig, input, zxpDir, tmpDir);
        if (isMetaPackage) {
          await metaPackage(
            cepConfig,
            zipDir,
            zxpPath,
            src,
            cepConfig.copyZipAssets
          );
        }
      }
    },
    async generateBundle(output: any, bundle: any) {
      console.log(
        `${conColors.green}cep process: ${
          (isPackage && "zxp package") || (isProduction && "build") || "dev"
        }`
      );

      // Fill any empty panel fields with extension's defaults
      const fillPanelFields = (config: CEP_Config) => {
        let newConfig: CEP_Config_Extended = {
          ...config,
          panels: config.panels.map((panel) => {
            let newProps: any = { ...config, ...panel };
            return {
              id: panel.id ? panel.id : `${config.id}.${panel.name}`,
              name: newProps.name,
              parameters: newProps.parameters,
              autoVisible: newProps.autoVisible,
              mainPath: newProps.mainPath,
              type: newProps.type,
              host: newProps.host,
              panelDisplayName: newProps.panelDisplayName,
              width: newProps.width,
              height: newProps.height,
              minWidth: newProps.minWidth,
              minHeight: newProps.minHeight,
              maxWidth: newProps.maxWidth,
              maxHeight: newProps.maxHeight,
              iconNormal: newProps.iconNormal,
              iconDarkNormal: newProps.iconDarkNormal,
              iconNormalRollOver: newProps.iconNormalRollOver,
              iconDarkNormalRollOver: newProps.iconDarkNormalRollOver,
              scriptPath: newProps.scriptPath,
              startOnEvents: newProps.startOnEvents,
            };
          }),
        };
        return newConfig;
      };

      const extendedConfig = fillPanelFields(cepConfig);

      const manifestFile = {
        type: "asset",
        source: prettifyXml(manifestTemplate(extendedConfig), {
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

        source: prettifyXml(debugTemplate(extendedConfig)),
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
      } catch (e) {
        console.warn(e);
      }

      console.log("");
    },
  };
};

export const jsxInclude = ({
  iife,
  globalThis,
}: {
  iife: boolean;
  globalThis: string;
}): Plugin | any => {
  const foundIncludes: string[] = [];
  return {
    name: "extendscript-include-resolver",
    generateBundle: (
      output: any,
      bundle: { [key: string]: { code: string } }
    ) => {
      const esFile = Object.keys(bundle).pop() as keyof object;
      const core = [
        "// ----- EXTENDSCRIPT INCLUDES ------ //",
        ...foundIncludes,
        "// ---------------------------------- //",
        bundle[esFile].code,
      ];
      if (iife) {
        const banner = `(function (${globalThis}) {`;
        const footer = "})(this);";
        bundle[esFile].code = [banner, ...core, footer].join("\r");
      } else {
        bundle[esFile].code = core.join("\r");
      }
    },
    transform: (code: string, id: string) => {
      const s = new MagicString(code);
      // console.log("looking for JSXINCLUDE");
      const includeMatches = code.match(/^\/\/(\s|)\@include(.*)/gm);
      if (includeMatches) {
        // console.log("FOUND!", matches);
        includeMatches.map((match: string) => {
          const innerMatches = match.match(/(?:'|").*(?:'|")/);
          const firstMatch = innerMatches?.pop();
          if (firstMatch) {
            const relativeDir = firstMatch.replace(/(\"|\')/g, "");
            const filePath = path.join(path.dirname(id), relativeDir);
            let text = "";
            if (fs.existsSync(filePath)) {
              text = fs.readFileSync(filePath, { encoding: "utf-8" });
              foundIncludes.push(text);
            } else {
              console.warn(
                `WARNING: File cannot be found for include ${match}`
              );
            }
            // console.log("INDEX :: ", code.indexOf(match));
            // console.log("CODE :: ", code);
            s.overwrite(
              code.indexOf(match),
              code.indexOf(match) + match.length,
              ""
            );
          }
        });
      }
      const commentMatches = code.match(/\/\/(\s|)\@(.*)/gm);
      if (commentMatches) {
        let end = 0;
        commentMatches.map((comment) => {
          const start = code.indexOf(comment, end);
          end = start + comment.length;
          s.overwrite(start, end, "");
        });
      }
      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          file: `${id}.map`,
          includeContent: true,
        }),
      };
    },
  };
};

interface PonyFillItem {
  find: string;
  replace: string;
  inject: string;
}
export const jsxPonyfill = (extraPonyfills?: PonyFillItem[]): Plugin | any => {
  let usedPonyfills = new Set<PonyFillItem>();
  let ponyfills: PonyFillItem[] = [
    {
      find: "Object.freeze",
      replace: "__objectFreeze",
      inject: `function __objectFreeze(obj) { return obj; }`,
    },
    {
      find: "Array.isArray",
      replace: "__isArray",
      inject: `function __isArray(arr) { try { return arr instanceof Array; } catch (e) { return false; } };`,
    },
  ];
  if (extraPonyfills) {
    ponyfills = [...ponyfills, ...extraPonyfills];
  }
  return {
    name: "extendscript-ponyfill-resolver",
    generateBundle: (
      output: any,
      bundle: { [key: string]: { code: string } }
    ) => {
      const esFile = Object.keys(bundle).pop() as keyof object;

      let ponyfillStr = [
        `// ----- EXTENDSCRIPT PONYFILLS -----`,
        Array.from(usedPonyfills)
          .map((p) => p.inject)
          .join("\r"),
        "// ---------------------------------- //",
      ].join("\r");

      const core = [ponyfillStr, bundle[esFile].code];
      bundle[esFile].code = core.join("\r");
    },
    renderChunk: (code: string, chunk: any) => {
      const id = chunk.fileName;
      const s = new MagicString(code);
      // console.log("Ponyfill Time");

      ponyfills.map((pony) => {
        const regexp = new RegExp(pony.find, "g");
        const gen = code.matchAll(regexp);
        // console.log("GEN", gen);
        if (gen) {
          const matches = [...gen];
          // console.log("FOUND!", pony.find);
          matches.map((match) => {
            usedPonyfills.add(pony);
            const index = match.index;
            const length = match[0].length;
            if (index) {
              // console.log("REPLACING :: ", index, index + length);
              s.overwrite(
                index,
                index + length,
                pony.replace
                // text
              );
            }
          });
        }
      });

      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          file: `${id}.map`,
          includeContent: true,
        }),
      };
    },
  };
};

export const runAction = (opts: CepOptions, action: string) => {
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

  const symlinkPath =
    cepConfig.symlink === "global"
      ? ccGlobalExtensionFolder
      : ccLocalExtensionFolder;
  const symlinkSrc = path.join(dir, cepDist);
  const symlinkDst = path.join(symlinkPath, cepConfig.id);

  if (action === "symlink") {
    makeSymlink(symlinkSrc, symlinkDst);
  } else if (action === "delsymlink") {
    removeSymlink(symlinkSrc, symlinkDst);
  } else if (action === "dependencyCheck") {
    console.log("Checking Dependencies");
    packageSync();
  } else {
    console.warn(`Unknown Action: ${action}`);
  }
  resetLog();
};

export const jsxBin = (jsxBinMode?: JSXBIN_MODE) => {
  return {
    name: "extendscript-jsxbin",
    generateBundle: async function (output: any, bundle: any) {
      if (jsxBinMode === "copy" || jsxBinMode === "replace") {
        const esFile = Object.keys(bundle).pop();
        if (esFile) {
          // console.log("GENERATE JSXBIN");
          const srcFilePathTmp = path.join(tmpDir, esFile);
          const esFileBin = esFile.replace("js", "jsxbin");
          const dstFilePathTmp = path.join(tmpDir, esFileBin);
          const tmpSrc = fs.writeFileSync(srcFilePathTmp, bundle[esFile].code, {
            encoding: "utf-8",
          });
          const jsxbin = require("jsxbin");
          await jsxbin(srcFilePathTmp, dstFilePathTmp);
          const output = fs.readFileSync(dstFilePathTmp, { encoding: "utf-8" });
          const jsxBinFile = {
            type: "asset",
            source: output,
            name: "JSXBIN",
            fileName: esFileBin,
          };
          //@ts-ignore
          this.emitFile(jsxBinFile);
          console.log(`JSXBIN Created: ${esFileBin}`);
          if (jsxBinMode === "replace") {
            delete bundle[esFile];
          }
        }
      }
    },
  };
};
