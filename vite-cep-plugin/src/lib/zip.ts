import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as archiver from "archiver";
import * as child_process from "child_process";
const { execSync } = child_process;

import { removeIfExists, safeCreate, log, resetLog } from "./lib";
import { CEP_Config } from "../cep-config";
import { copyFiles } from "../copy-node";

const createZip = (src: string, dst: string, name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip");
    const zipDest = path.join(dst, `${name}.zip`);
    const output = fs.createWriteStream(zipDest);
    output.on("close", () => {
      // console.log(`zip archive created. ( ${archive.pointer()} bytes )`);
      resolve(zipDest);
    });
    archive.on("error", (err) => {
      reject(err.message);
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(src, false);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    //   archive.directory(dst, "new-subdir");

    archive.finalize();
  });
};

export const metaPackage = async (
  config: CEP_Config,
  dest: string,
  zxp: string,
  src: string,
  assets?: string[]
) => {
  const tmpDir = path.join(dest, "tmp");
  console.log({
    dest,
    zxp,
    src,
    assets,
  });
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.copyFileSync(zxp, path.join(tmpDir, path.basename(zxp)));

  if (assets) {
    copyFiles({
      src,
      dest: tmpDir,
      assets,
    });
  }

  const zip = await createZip(
    tmpDir,
    dest,
    `${config.displayName}_${config.version}`
  );
  log("built zip", true, zip);
  fs.rmSync(tmpDir, { recursive: true });
  resetLog();
  return zip;
};
