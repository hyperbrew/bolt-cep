import os from "os";
import path from "path";
import fs from "fs-extra";
import { execSync } from "child_process";
import { log, resetLog, conColors } from "./lib";

import { cepFunction } from "../types";

export const runCustomFunction = ({
  cepFunction,
  value,
}: {
  cepFunction: cepFunction;
  value: string;
}) => {
  console.log("");
  console.log(`${conColors.green}cep process: custom function: ${cepFunction}`);

  functions[cepFunction](value);
  resetLog();
};

const functions = {
  debugon: () => {
    debugSwitch(1);
  },
  debugoff: () => {
    debugSwitch(0);
  },

  setlog: (value: any) => {
    setLogging(value);
  },
};

const debugSwitch = (state: 1 | 0) => {
  let csxsFiles: string[] = [];
  if (os.platform() == "win32") {
    const qStr = "REG QUERY HKEY_CURRENT_USER\\Software\\Adobe\\";
    const stdout = execSync(qStr, { encoding: "utf8" });
    const entries = stdout.split(/\r|\n/);
    entries.forEach((file) => {
      if (file.indexOf("CSXS") > -1) {
        csxsFiles.push(file);
        const changeStr =
          "REG ADD " +
          file +
          " /v PlayerDebugMode /t REG_SZ /d " +
          state +
          " /f";
        execSync(changeStr, { encoding: "utf8" });
      }
    });
  } else if (os.platform() == "darwin") {
    const pDir = path.join(os.homedir(), "/Library/Preferences");
    const pFiles = fs.readdirSync(pDir);
    pFiles.forEach((file) => {
      if (file.indexOf("com.adobe.CSXS") > -1) {
        csxsFiles.push(file);
        const cmdStr =
          "defaults write " +
          path.join(pDir, file) +
          " PlayerDebugMode " +
          state;
        execSync(cmdStr, { cwd: pDir, encoding: "utf8" });
      }
    });
  }
  console.log(
    `${
      (state === 1 && "enabled") || "disabled"
    } player debug mode for cep -> ` +
      csxsFiles.toString().match(/[0-9]/g)?.join(", ")
  );
};

const setLogging = (level: number) => {
  let csxsFiles: string[] = [];
  if (os.platform() == "win32") {
    const qStr = "REG QUERY HKEY_CURRENT_USER\\Software\\Adobe\\";
    const stdout = execSync(qStr, { encoding: "utf8" });
    const entries = stdout.split(/\r|\n/);
    entries.forEach((file) => {
      if (file.indexOf("CSXS") > -1) {
        csxsFiles.push(file);
        const changeStr =
          "REG ADD " + file + " /v LogLevel /t REG_SZ /d " + level + " /f";
        execSync(changeStr, { encoding: "utf8" });
      }
    });
  } else if (os.platform() == "darwin") {
    const pDir = path.join(os.homedir(), "/Library/Preferences");
    const pFiles = fs.readdirSync(pDir);
    pFiles.forEach((file) => {
      if (file.indexOf("com.adobe.CSXS") > -1) {
        csxsFiles.push(file);
        const cmdStr =
          "defaults write " + path.join(pDir, file) + " LogLevel " + level;
        execSync(cmdStr, { cwd: pDir, encoding: "utf8" });
      }
    });
  }
  console.log(
    `Logging level set to ${level} for cep -> ` +
      csxsFiles.toString().match(/[0-9]/g)?.join(", ")
  );
};
