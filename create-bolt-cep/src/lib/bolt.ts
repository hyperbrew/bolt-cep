import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { replaceInFile } from "./replace";
import { updateObjectProperty, updateSwitchStatement } from "./ts-morph";
import { Options, frameworkOptions, appOptions, getFramework } from "./options";

export async function installBolt({
  dir,
  framework,
  template,
  apps,
  displayName,
  id,
}: Options) {
  const root = path.join(__dirname, "..", "..");
  const localBolt = path.join(root, "node_modules", "bolt-cep");
  const globalBolt = path.join(root, "..", "bolt-cep");

  let bolt = fs.existsSync(localBolt) ? localBolt : globalBolt;
  // bolt = globalBolt; // for use when testing against dev version of `bolt-cep`
  const isSymlink = fs.lstatSync(bolt).isSymbolicLink();
  bolt = isSymlink ? fs.realpathSync(bolt) : bolt;

  fs.mkdirSync(dir.path, { recursive: true });

  // Get Unused Packages
  const unused = frameworkOptions
    .filter((item) => item.value !== framework)
    .map((i) => i.value);

  const ignoreItems = [
    ".git",
    "node_modules",
    "dist",
    "cep.config.debug.ts",
    "tsconfig.json",
    "vite.config.ts",
    "package.json",
  ];

  unused.map((item) => {
    ignoreItems.push(`vite.config.${item}.ts`);
    ignoreItems.push(`package.${item}.json`);
    ignoreItems.push(`tsconfig.${item}.json`);
  });

  fs.readdirSync(bolt).map((item) => {
    if (!ignoreItems.includes(item)) {
      const srcItem = path.join(bolt, item);
      if (item === `vite.config.${framework}.ts`) {
        fs.copySync(srcItem, path.join(dir.path, `vite.config.ts`));
      } else if (item === `package.${framework}.json`) {
        fs.copySync(srcItem, path.join(dir.path, `package.json`));
      } else if (item === `tsconfig.${framework}.json`) {
        fs.copySync(srcItem, path.join(dir.path, `tsconfig.json`));
      } else {
        fs.copySync(srcItem, path.join(dir.path, item));
      }
    }
  });
  const jsFolder = path.join(dir.path, "src", "js");
  const jsxFolder = path.join(dir.path, "src", "jsx");

  // Remove Placeholder
  const tempMain = path.join(jsFolder, "main");
  if (fs.existsSync(tempMain)) {
    fs.rmSync(tempMain, { recursive: true });
  } else {
    console.error("TEMP MAIN doesn't exist");
  }

  // Move Template
  const templateFolder = path.join(jsFolder, `template-${framework}`);
  const newName = path.join(jsFolder, `main`);
  if (fs.existsSync(templateFolder)) {
    fs.renameSync(templateFolder, newName);
  }

  // Delete Extra Templates
  fs.readdirSync(jsFolder).map((extraTemplate) => {
    if (extraTemplate.indexOf("template-") === 0) {
      fs.rmSync(path.join(jsFolder, extraTemplate), { recursive: true });
    }
  });

  // Remove Debug Lines from config
  const cepConfig = path.join(dir.path, "cep.config.ts");
  replaceInFile(cepConfig, [[/.*(\/\/ BOLT-CEP-DEBUG-ONLY).*/g, ""]]);

  // Add .gitignore
  fs.writeFileSync(
    path.join(dir.path, ".gitignore"),
    ["node_modules", "dist", ".DS_Store"].join("\r"),
    { encoding: "utf-8" }
  );

  // Handle template
  if (template === "skeleton") {
    [
      path.join("..", "public"),
      "assets",
      "favicon.svg",
      path.join("main", "main.scss"),
      "index.scss",
      "variables.scss",
    ].forEach((file) => fs.removeSync(path.join(jsFolder, file)));

    // remove references
    // TODO: fix this.. as it currently breaks CEP panel.
    // empty string becomes `undefined` in `manifest.xml` which prevents panel from appearing in Extensions menu of host apps
    // replaceInFile(cepConfig, [
    //   [`iconDarkNormal: "./src/assets/light-icon.png",\n`, ""],
    //   [`iconNormal: "./src/assets/dark-icon.png",\n`, ""],
    //   [`iconDarkNormalRollOver: "./src/assets/light-icon.png",\n`, ""],
    //   [`iconNormalRollOver: "./src/assets/dark-icon.png",\n`, ""],
    // ]);

    [path.join("main", "index.tsx"), path.join("main", "index.ts")].forEach(
      (file) => {
        const filePath = path.join(jsFolder, file);
        if (fs.existsSync(filePath)) {
          replaceInFile(filePath, [[`import "../index.scss";`, "\n"]]);
        }
      }
    );

    const inlineStyle =
      framework === "react" ? `{{ color: "#ff5b3b" }}` : `"color: #ff5b3b;"`;
    const h1 = `<h1 style=${inlineStyle}>Welcome to Bolt CEP!</h1>`;
    const strings = {
      react: `const Main = () => {\n  return (\n    <div>\n      ${h1}\n    </div>\n  );\n};\nexport default Main;`,
      svelte: h1,
      vue: `<template>\n  ${h1}\n</template>`,
    };

    [
      path.join("main", "main.tsx"),
      path.join("main", "main.svelte"),
      path.join("main", "main.vue"),
    ].forEach((file) => {
      const filePath = path.join(jsFolder, file);
      if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, strings[framework]);
      }
    });
  }

  // Handle Adobe apps
  if (template === "skeleton" && Array.isArray(apps)) {
    const index = path.join(jsxFolder, "index.ts");

    const selectedApps = appOptions.filter((x) => apps.includes(x.value));
    updateSwitchStatement(index, selectedApps);

    selectedApps.forEach(({ value }) => {
      const filePath = path.join(jsxFolder, value, `${value}.ts`);
      if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "export const example = () => {};");
      }
    });

    const hostAppStrings = apps.map((x) => {
      const name = x === "anim" ? "FLPR" : x.toUpperCase();
      return `{ name: "${name}", version: "[0.0,99.9]" }`;
    });
    updateObjectProperty(
      cepConfig,
      "config",
      "hosts",
      `[\n${hostAppStrings.join(",\n")}\n]`
    );

    const rejectedApps = appOptions.filter((x) => !apps.includes(x.value));
    rejectedApps.forEach(({ value }) => fs.removeSync(path.join(jsxFolder, value))); // prettier-ignore
    fs.removeSync(path.join(jsxFolder, "utils"));
  }

  // Replace "Bolt-CEP", "bolt-cep", "com.bolt.cep"
  const label = getFramework(framework)?.label!;
  const index = path.join(jsFolder, "main", "index.html");
  if (displayName) {
    replaceInFile(index, [[`Bolt CEP ${label}`, displayName]]);
    replaceInFile(cepConfig, [["Bolt CEP", displayName]]);
  }
  if (id) {
    replaceInFile(cepConfig, [["com.bolt.cep", id]]);
  }

  // set jsxbin to "off" for Apple Silicon
  const isAppleSilicon = os.cpus().some((cpu) => cpu.model.includes("Apple"));
  if (isAppleSilicon) {
    const replaceWithOff = `jsxBin: "off", // Not supported on Apple Silicon (yet)`;
    replaceInFile(cepConfig, [
      [`jsxBin: "copy",`, replaceWithOff],
      [`jsxBin: "replace",`, replaceWithOff],
    ]);
  }

  // // super secret, super opinionated, super aggressive "hide files you likely won't touch" setting
  // let hideFiles = false; // TODO: pass as secret flag
  // if (hideFiles) {
  //   const exclude = {
  //     "files.exclude": {
  //       "src/js/**/*.d.ts": true,
  //       "src/jsx/**/*.d.ts": true,
  //       "src/jsx/**/tsconfig.json": true,
  //       "src/jsx/lib": true,
  //       "src/shared": true,
  //       "tsconfig-build.json": true,
  //       LICENSE: true,
  //     },
  //   };
  //   const vscode = path.join(dir.path, ".vscode");
  //   fs.mkdirSync(vscode);
  //   fs.writeFileSync(
  //     path.join(vscode, "settings.json"),
  //     JSON.stringify(exclude)
  //   );
  // }
}
