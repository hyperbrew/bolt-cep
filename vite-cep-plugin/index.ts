import os from "os";
import path from "path";

import fs from "fs-extra";
const prettifyXml = require("prettify-xml");

import { log, conColors } from "./lib/lib";
import { signZXP } from "./lib/zxp";
import { manifestTemplate } from "./templates/manifest-template";
import { debugTemplate } from "./templates/debug-template";
import { devHtmlTemplate } from "./templates/dev-html-template";
import { htmlTemplate } from "./templates/html-template";
import { ResolvedConfig } from "vite";

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

interface CepOptions {
  // attributes: any;
  cepConfig: any;
  dir: string;
  isProduction: boolean;
  isPackage: boolean;
  isLocal: boolean;
  debugReact: boolean;
  siteDist: string;
  cepDist: string;
  zxpDir: string;
}

export const cep = (opts: CepOptions) => {
  const {
    // attributes,
    cepConfig,
    dir,
    isProduction,
    isPackage,
    isLocal,
    debugReact,
    siteDist,
    cepDist,
    zxpDir,
  } = opts;
  return {
    name: "cep",
    // transformIndexHtml(code: string) {
    //   only runs on dev
    //   console.log(index);
    //   const jsFileName = Object.keys(bundle).find(
    //     (key) => key.split(".").pop() === "js"
    //   );
    //   htmlTemplate({
    //     ...cepConfig,
    //     debugReact,
    //     jsFileName,
    //   })
    //   return "test123";
    // },
    writeBundles(args, bundle) {
      const jsFileName = Object.keys(bundle).find(
        (key) => key.split(".").pop() === "js"
      );
      const indexHtmlFile = {
        type: "asset",

        source: htmlTemplate({
          ...cepConfig,
          debugReact,
          jsFileName,
        }),
        name: "CEP HTML Build File",
        fileName: `panel.html`,
      };
      //@ts-ignore
      this.emitFile(indexHtmlFile);
      return bundle;
    },
    configResolved(config: ResolvedConfig) {
      if (config.env["MODE"] === "development") {
        const panelHtmlFile = {
          type: "asset",
          source: devHtmlTemplate({
            ...cepConfig,
            url: isProduction
              ? cepConfig.finalURL
              : `http://localhost:${cepConfig.port}/`,
          }),
          name: "CEP HTML Dev File",
          fileName: "panel.html",
        };
        fs.writeFileSync(
          path.join("dist", "cep", "panel.html"),
          panelHtmlFile.source
        );
        log("dev html file created", true);
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
      if (isPackage) {
        signZXP(cepConfig, path.join(dir, cepDist), zxpDir);
      } else {
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

        const debugFile = {
          type: "asset",

          source: prettifyXml(debugTemplate(cepConfig)),
          name: "CEP Debug File",
          fileName: path.join(".debug"),
        };
        //@ts-ignore
        this.emitFile(debugFile);
        log("debug file created", true);

        const indexHtmlFile = {
          type: "asset",

          source: htmlTemplate({ ...cepConfig, debugReact, jsFileName }),
          name: "CEP HTML Build File",
          fileName: "panel.html",
        };
        //@ts-ignore
        this.emitFile(indexHtmlFile);
        log("panel html file created", true);

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
      }
      console.log("");
    },
  };
};

export const jsxInclude = (opts = {}) => {
  const foundIncludes: string[] = [];
  return {
    name: "ExtendScript Include Resolver",

    renderChunk: (code: string, id: string) => {
      code = [...foundIncludes, code].join("\r");
      return {
        code: code,
      };
    },

    transform: (code: string, id: string) => {
      const matches = code.match(/\/\/\@include(.*)('|")(.*)('|")(.*)/g);
      if (matches) {
        matches.map((match: string) => {
          const innerMatches = match.match(/('|")(.*)('|")/);
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
      return {
        code: code,
      };
    },
  };
};
