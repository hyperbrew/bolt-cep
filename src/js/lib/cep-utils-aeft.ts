import { fs, path } from "./node";
import { csi } from "./utils";

export const getOutputModules = (): string[] => {
  const appVersion = csi.getHostEnvironment().appVersion;
  const { platform, env } = window.cep_node.process;
  const mainDir =
    platform == "darwin"
      ? `${env.HOME}/Library/Preferences`
      : env.APPDATA || "";
  const prefsDir = path.join(
    mainDir,
    "Adobe",
    "After Effects",
    parseFloat(appVersion).toFixed(1).toString()
  );
  const prefsSuffix = "indep-output.txt";

  let outputPref: string | null = null;

  const getModified = (fullpath: string) =>
    fs.statSync(fullpath).mtime.valueOf();

  fs.readdirSync(prefsDir)
    .filter((file) => file.includes(prefsSuffix))
    .map((file) => {
      if (
        outputPref === null ||
        getModified(path.join(prefsDir, file)) >
          getModified(path.join(prefsDir, outputPref))
      ) {
        outputPref = file;
      }
    });

  if (outputPref) {
    const txt = fs.readFileSync(path.join(prefsDir, outputPref), {
      encoding: "utf-8",
    });
    const matches = txt.match(
      /\"Output Module Spec Strings Name .* = \".*.\"/g
    );
    if (matches) {
      let outputModules: string[] = [];
      matches.map((line) => {
        const str = line.split("=").pop()?.trim().replace(/"/g, "");
        if (str && !str.includes("_HIDDEN X-Factor")) {
          outputModules.push(str);
        }
      });
      return outputModules;
    }
  }
  return [];
};
