import os from "os";
import fs from "fs-extra";

export const conColors = {
  white: "\u001b[0m",
  whiteBold: "\u001b[1;37m",
  cyan: "\u001b[1;36m",
  purple: "\u001b[1;35m",
  blue: "\u001b[1;34m",
  yellow: "\u001b[1;33m",
  green: "\u001b[1;32m",
  red: "\u001b[1;31m",
  grey: "\u001b[1;30m",
};

export const log = (str: string, succeeded: boolean, info?: string) => {
  const res = succeeded ? "succeeded √" : "failed ×";
  const color = succeeded ? conColors.cyan : conColors.red;
  console.log(`${color}${str} → ${res} ${(info && ":") || ""} ${info || ""}`);
  if (!succeeded) throw info;
};

export const resetLog = () => {
  console.log(conColors.white);
};

export const sep = os.platform() == "win32" ? "\\" : "/";

export const removeIfExists = (dir: string) => {
  try {
    fs.existsSync(dir) && fs.removeSync(dir);
    return [true, "Removed"];
  } catch (e) {
    return [false, e];
  }
};

export const safeCreate = (dir: string) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      return [true, "Created"];
    }
    return [true, "Already Exists"];
  } catch (e) {
    return [false, e];
  }
};

export const posix = (str: string) => str.replace(/\\/g, "/");
