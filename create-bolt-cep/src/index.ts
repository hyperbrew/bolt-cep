#!/usr/bin/env node

import * as color from "picocolors";
import { intro, note, outro, spinner } from "@clack/prompts";
import { prompts } from "./lib/prompts";
import { installBolt } from "./lib/bolt";
import { getApp, getFramework, getTemplate, isString } from "./lib/options";
import { parseArgs, throwError } from "./lib/parse-args";
import { installDeps, initGit, buildBolt } from "./lib/utils";

main();

async function main() {
  console.clear();
  boltIntro();

  let options = await parseArgs();
  let source: "cli" | "prompts" = "cli";
  if (isString(options)) {
    options = await prompts({ dir: options });
    source = "prompts";
  }

  // prettier-ignore
  const pretty = {
    framework: getFramework(options.framework)?.label,
    template: getTemplate(options.template)?.label,
    apps: options.apps.map((x) => getApp(x)?.label).join(", ")
  }

  if (source === "cli") {
    if (options.dir.exists && !options.dir.isEmpty)
      throwError("<appname>", `path is not empty.`, options.dir.path);

    note(
      [
        `panel      ${options.dir.name} (${options.displayName})`,
        `id         ${options.id}`,
        `framework  ${pretty.framework}`,
        `template   ${pretty.template}`,
        `apps       ${pretty.apps}`,
      ].join("\n"),
      "Inputs"
    );
  }

  const s = spinner();
  s.start("Installing bolt-cep");
  await installBolt(options);
  s.stop(`Installed ${color.bgGreen(` bolt-cep `)}.`);

  if (options.installDeps) {
    s.start("Installing dependencies via yarn");
    await installDeps(options);
    s.stop("Installed dependencies via yarn.");

    s.start("Running initial build");
    await buildBolt(options);
    s.stop("Built!");
  }

  // if (options.git) {
  //   s.start("Initializing git repo");
  //   await initGit(options);
  //   s.stop("Initialized git repo.");
  // }

  note(
    [
      `${pretty?.template} Bolt CEP generated with ${pretty?.framework}` +
        `: ${color.green(color.bold(options.dir.name))}`,
      options.dir.path,
    ].join("\n"),
    "Summary"
  );

  outro(
    `Problems? ${color.cyan(
      color.underline(`https://github.com/hyperbrew/bolt-cep`)
    )}`
  );
}

function boltIntro() {
  console.log();
  const cbc = color.bgGreen(` create-bolt-cep `);
  const url = color.underline("https://hyperbrew.co");
  const bru = color.gray("│   ") + color.cyan(`by Hyper Brew | ${url}`);
  intro(`${cbc} \n${bru}`);
}
