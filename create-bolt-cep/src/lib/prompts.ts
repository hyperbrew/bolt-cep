import {
  text,
  select,
  multiselect,
  isCancel,
  cancel,
  confirm,
} from "@clack/prompts";
import {
  appOptions,
  Framework,
  frameworkOptions,
  getFramework,
  isAppStringArray,
  isBoolean,
  isFrameworkString,
  isString,
  isTemplateString,
  Options,
  templateOptions,
} from "./options";
import * as color from "picocolors";
import { formatTitle } from "./format-title";
import { parsePath } from "./parse-path";

export async function prompts(options: { dir: string }): Promise<Options> {
  // dir
  const placeholder = options.dir ? options.dir : "./";
  let dir: symbol | string | ReturnType<typeof parsePath> = await text({
    message: "Where do you want to create your project?",
    placeholder: placeholder,
    initialValue: placeholder,
    defaultValue: placeholder,
    validate(value) {
      const dir = parsePath(value);
      if (dir.exists) return `Heads up! ${dir.path} already exists.`;
      if (!dir.isEmpty) return `Heads up! ${dir.path} is not empty.`;
    },
  });

  handleCancel(dir);
  if (!isString(dir)) throw new Error("");
  dir = parsePath(dir);

  // framework
  const framework = await select({
    message: "Which UI framework would you like to use?",
    options: frameworkOptions,
    initialValue: "svelte",
  });

  handleCancel(framework);
  const frameworkLabel = getFramework(framework as Framework)?.label;

  // template
  const template = await select({
    message: `Which ${frameworkLabel} template would you like to start with?`,
    options: templateOptions,
    initialValue: "demo",
  });

  handleCancel(template);

  // adobe apps
  let apps: symbol | string[] = [];
  let displayName: symbol | string = "";
  let id: symbol | string = "";
  if (template === "skeleton") {
    apps = await multiselect({
      message: "Which Adobe apps do you want to support?",
      options: appOptions,
      required: true,
    });

    handleCancel(apps);
  }
  const titlePlaceholder = formatTitle(dir.name);
  displayName = await text({
    message: "What do you want to use as your panel's display name?",
    placeholder: titlePlaceholder,
    initialValue: titlePlaceholder,
    defaultValue: titlePlaceholder,
  });

  handleCancel(displayName);

  id = await text({
    message: "What do you want to use as your panel's id?",
    placeholder: `com.${dir.name}.cep`,
    initialValue: `com.${dir.name}.cep`,
    defaultValue: `com.${dir.name}.cep`,
  });

  handleCancel(id);

  // install dependencies
  const recommended = color.gray("(recommended)");
  const installDeps = await confirm({
    message: `Do you want to install dependencies? ${recommended}`,
    initialValue: true,
  });

  handleCancel(installDeps);

  // git repo
  // const git = await confirm({
  //   message: "Do you want to initialize a new git repository?",
  //   initialValue: true,
  // });

  // handleCancel(git);

  if (!isFrameworkString(framework)) throw new Error("");
  if (!isTemplateString(template)) throw new Error("");
  if (!isAppStringArray(apps)) throw new Error("");
  if (!isString(displayName)) throw new Error("");
  if (!isString(id)) throw new Error("");
  if (!isBoolean(installDeps)) throw new Error("");
  // if (!isBoolean(git)) return;

  return { dir, framework, template, apps, displayName, id, installDeps, git: false }; // prettier-ignore
}

function handleCancel(value: unknown) {
  if (isCancel(value)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
}
