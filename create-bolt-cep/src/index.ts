#!/usr/bin/env node

import { main } from "meta-bolt";
import type { BoltInitData, ArgOpt } from "meta-bolt";

export const frameworkOptions: ArgOpt[] = [
  {
    value: "svelte",
    label: "Svelte",
    files: [
      "src/main/index-svelte.ts",
      "src/main/main.svelte",
      "package.svelte.jsonc",
    ],
  },
  {
    value: "react",
    label: "React",
    files: [
      "src/main/index-react.tsx",
      "src/main/main.tsx",
      "package.react.jsonc",
    ],
  },
  {
    value: "vue",
    label: "Vue",
    files: ["src/main/index-vue.ts", "src/main/main.vue", "package.vue.jsonc"],
  },
];

export const appOptions: ArgOpt[] = [
  {
    value: "figma",
    label: "Figma ( Design Mode )",
    files: ["src/api/figma.ts"],
  },
  {
    value: "figmadev",
    label: "Figma ( Dev Mode )",
    files: ["src/api/figjam.ts"],
  },
  { value: "figjam", label: "Figjam", files: ["src/api/figjam.ts"] },
];

const initData: BoltInitData = {
  intro: {
    name: "create-bolt-figma",
    prettyName: "Bolt Figma",
  },
  base: {
    module: "bolt-figma",
    createDirName: __dirname,
    globalIncludes: [
      "*",
      "src/**/*",
      "src-code/**/*",
      "shared/**/*",
      "public/**/*",
      "public-zip/**/*",
      ".github/**/*",
      ".gitignore",
      ".npmrc",
      ".prettierrc",
      ".env.example",
    ],
    globalExcludes: [".env", "yarn-error.log", "package.json"],
    fileRenames: [
      ["package.svelte.jsonc", "package.json"],
      ["package.react.jsonc", "package.json"],
      ["package.vue.jsonc", "package.json"],
      [".npmignore", ".gitignore"],
    ],
  },
  argsTemplate: [
    {
      name: "folder",
      type: "folder",
      message: "Where do you want to create your project?",
      initialValue: "./",
      required: true,
      validator: (input: string) => {
        if (input.length < 3) return `Value is required!`;
      },
      describe: "Name of the folder for the new Figma plugin",
    },
    {
      name: "displayName",
      type: "string",
      message: "Choose a unique Display Name for your plugin:",
      initialValue: "Bolt Figma",
      required: true,
      validator: (input: string) => {
        if (input.length < 1) return `Value is required!`;
      },
      describe: "Panel's display name",
      alias: "n",
    },
    {
      name: "id",
      type: "string",
      message: "Choose a unique ID for your plugin:",
      initialValue: "bolt.figma.plugin",
      required: true,
      validator: (input: string) => {
        if (input.length < 1) return `Value is required!`;
      },
      describe: "Unique ID for Figma Plugin (e.g. bolt.figma.plugin)",
      alias: "i",
    },
    {
      name: "framework",
      type: "select",
      message: "Select framework:",
      alias: "f",
      describe: "Select a Framework for your plugin:",
      options: frameworkOptions,
      required: true,
    },
    {
      name: "apps",
      type: "multiselect",
      message: "Select app:",
      alias: "a",
      describe: "Select app(s) for your plugin:",
      options: appOptions,
      validator: (input: string[]) => {
        if (input.length < 1) return `At Least One value Required!`;
        if (
          input.length === 2 &&
          input.includes("figjam") &&
          input.includes("figmadev")
        )
          return `You cannot select only "Figma (Dev Mode)" & "FigJam".\nIf you want to include both, you must also include "Figma (Design Mode)"`;
      },
      required: true,
    },
    {
      name: "installDeps",
      type: "boolean",
      message: "Install dependencies?",
      initialValue: true,
      required: true,
      alias: "d",
      describe: "Install dependencies (default: false)",
    },
    {
      name: "sampleCode",
      type: "boolean",
      message: "Keep Sample Code Snippets?",
      initialValue: true,
      required: true,
      alias: "s",
      describe: "Keep Sample Code (default: true)",
    },
  ],
};

//* if not using as a module, run immediately
console.log("BOLT_MODULEONLY", process.env.BOLT_MODULEONLY);
if (!process.env.BOLT_MODULEONLY) main(initData);
