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
import { runCustomFunction } from "./lib/custom-function";

import { cepFunction } from "./types";

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
  config: any;
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
    config,
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
    async generateBundle(output: any, bundle: any) {
      console.log("");
      console.log(
        `${conColors.green}cep process: ${
          (isPackage && "zxp package") || (isProduction && "build") || "dev"
        }`
      );
      if (isPackage) {
        signZXP(config, path.join(dir, cepDist), zxpDir);
      } else {
        const manifestFile = {
          type: "asset",
          source: prettifyXml(manifestTemplate(config), {
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

          source: prettifyXml(debugTemplate(config)),
          name: "CEP Debug File",
          fileName: path.join(".debug"),
        };
        //@ts-ignore
        this.emitFile(debugFile);
        log("debug file created", true);
        const indexHtmlFile = {
          type: "asset",

          source: htmlTemplate({ ...config, debugReact }),
          name: "CEP HTML Build File",
          fileName: path.join(
            siteDist,

            isProduction && isLocal ? config.mainPath : "index.html"
          ),
        };
        //@ts-ignore
        // this.emitFile(indexHtmlFile);
        log("html file created", true);

        if (!isProduction || !isLocal) {
          // dev html to forward to production html for live-reload
          const panelHtmlFile = {
            type: "asset",
            source: devHtmlTemplate({
              ...config,
              url: isProduction
                ? config.finalURL
                : `http://localhost:${config.port}/`,
            }),
            name: "CEP HTML Dev File",

            fileName: path.join(config.mainPath),
          };
          //@ts-ignore
          // this.emitFile(panelHtmlFile);
          log("dev html file created", true);
        }
        try {
          const symlinkPath =
            config.symlink === "global"
              ? ccGlobalExtensionFolder
              : ccLocalExtensionFolder;
          const res = makeSymlink(
            path.join(dir, cepDist),

            path.join(symlinkPath, config.id)
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

export const customFunction = ({
  cepFunction,
  value,
}: {
  cepFunction: cepFunction;
  value: string;
}) => {
  runCustomFunction({ cepFunction, value });
};
