import * as path from "path";
import * as resolve from "resolve-dir";
import * as fs from "fs-extra";

export function parsePath(appNameOrPath: string) {
  const appPath = path.resolve(resolve(appNameOrPath));
  const appName = path.basename(appPath);
  const exists = dirExists(appPath);
  const isEmpty = exists ? isDirEmpty(appName) : true;
  // const overwrite = appNameOrPath.charAt(0) === "!"; // TODO: allow overwriting of exisiting or non empty path
  return { path: appPath, name: appName, exists, isEmpty };
}

function dirExists(dirPath: string) {
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch (error: any) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function isDirEmpty(dirPath: string) {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries.length === 0;
  } catch (error: any) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
