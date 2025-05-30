import { readFileSync } from "fs";

type PackageJSON = {
  name: string;
  version: string;
  scripts: {
    [key: string]: string;
  };
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
  main: string;
  license: string;
};

export const packageSync = () => {
  const pack = readFileSync("package.json", "utf-8");
  const packJson = JSON.parse(pack) as PackageJSON;

  const packSvelte = readFileSync("package.svelte.json", "utf-8");
  const svelte = JSON.parse(packSvelte) as PackageJSON;

  const packVue = readFileSync("package.vue.json", "utf-8");
  const vue = JSON.parse(packVue) as PackageJSON;

  const packReact = readFileSync("package.react.json", "utf-8");
  const react = JSON.parse(packReact) as PackageJSON;

  const svelteWarnings: string[] = [];
  const vueWarnings: string[] = [];
  const reactWarnings: string[] = [];

  Object.keys(packJson.dependencies).map((dep) => {
    const version = packJson.dependencies[dep];
    const svelteVersion = svelte.dependencies[dep];
    const vueVersion = vue.dependencies[dep];
    const reactVersion = react.dependencies[dep];

    if (svelteVersion && svelteVersion !== version) {
      svelteWarnings.push(`svelte: ${dep} ${svelteVersion} -> ${version}`);
    }
    if (vueVersion && vueVersion !== version) {
      vueWarnings.push(`vue: ${dep} ${vueVersion} -> ${version}`);
    }
    if (reactVersion && reactVersion !== version) {
      reactWarnings.push(`react: ${dep} ${reactVersion} -> ${version}`);
    }
  });

  Object.keys(packJson.devDependencies).map((dep) => {
    const version = packJson.devDependencies[dep];
    const svelteVersion = svelte.devDependencies[dep];
    const vueVersion = vue.devDependencies[dep];
    const reactVersion = react.devDependencies[dep];

    if (svelteVersion && svelteVersion !== version) {
      svelteWarnings.push(
        `svelte (devDependencies): ${dep} ${svelteVersion} -> ${version}`
      );
    }
    if (vueVersion && vueVersion !== version) {
      vueWarnings.push(
        `vue (devDependencies): ${dep} ${vueVersion} -> ${version}`
      );
    }
    if (reactVersion && reactVersion !== version) {
      reactWarnings.push(
        `react (devDependencies): ${dep} ${reactVersion} -> ${version}`
      );
    }
  });

  console.log("Svelte Warnings", svelteWarnings);
  console.log("Vue Warnings", vueWarnings);
  console.log("React Warnings", reactWarnings);
};
