import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import * as child_process from "child_process";
const { execSync } = child_process;

import { removeIfExists, safeCreate, log, pause } from "./lib";
import { CEP_Config } from "../cep-config";
import { existsSync, readdirSync } from "fs";

export const signZXP = async (
  config: CEP_Config,
  input: string,
  zxpDir: string,
  tmpDir: string
) => {
  const zxpCmd = os.platform() == "win32" ? `ZXPSignCmd` : `./ZXPSignCmd`;

  if (os.platform() === "darwin") {
    const zxpsignCmdPath = path.join(__dirname, "..", "bin", "ZXPSignCmd");
    const stat = fs.statSync(zxpsignCmdPath);
    const isExecutable = (stat.mode & 0o111) !== 0;
    if (!isExecutable) {
      console.error("ZXPSignCmd is not executable. Changing permissions...");
      fs.chmodSync(zxpsignCmdPath, stat.mode | 0o111);
      console.log("ZXPSignCmd is now executable.");
    }
  }

  const name = config.id;
  const data = config.zxp;
  const output = path.join(zxpDir, `${name}.zxp`);
  const certPath = path.join(tmpDir, `${name}-cert.p12`);
  const signPrepStr = `${zxpCmd} -selfSignedCert ${data.country} ${data.province} ${data.org} ${name} ${data.password} "${certPath}"`;
  const cwdDir = path.join(__dirname, "..", "bin");

  removeIfExists(certPath);
  removeIfExists(output);
  safeCreate(zxpDir);
  console.log({ signPrepStr });
  execSync(signPrepStr, { cwd: cwdDir, encoding: "utf-8" });

  const jsx = path.join(input, "jsx");
  let waits = 1;
  while (!existsSync(jsx) || readdirSync(jsx).length === 0) {
    console.log(`waiting for ExtendScript to finish... ${100 * waits++}ms`);
    await pause(100);
  }

  let signStr = `${zxpCmd} -sign "${input}" "${output}" "${certPath}" ${data.password}`;

  let numTSAs = 0;
  if (data.tsa) {
    if (typeof data.tsa === "string") {
      if (data.tsa !== "") {
        numTSAs = 1;
      }
    } else if (typeof data.tsa === "object") {
      numTSAs = data.tsa.filter((t) => t.length > 0).length;
    }
  }

  let success = false;
  let failures = 0;
  for (let i = 0; i < numTSAs; i++) {
    const currentTSA = Array.isArray(data.tsa) ? data.tsa[i] : data.tsa;
    if (currentTSA === "") continue;
    const finalSignStr = signStr + ` -tsa ${currentTSA}`;
    console.log({ finalSignStr });
    try {
      execSync(finalSignStr, { cwd: cwdDir, encoding: "utf-8" });
      success = true;
      break;
    } catch (error) {
      console.warn(
        `⚠️ - Error signing with TSA ${currentTSA}.`,
        //@ts-ignore
        error?.message
      );
      failures++;
    }
  }

  if (!success) {
    let reason = failures > 0 ? "TSA Signing Failed" : "No TSA URL provided";
    if (config.zxp.allowSkipTSA) {
      console.warn(
        `⚠️ - ${reason}. The ZXP will be built without a TSA meaning it will expire.`
      );
      execSync(signStr, { cwd: cwdDir, encoding: "utf-8" });
    } else {
      throw new Error(
        `⚠️ - ${reason}. Job aborted. To complete without a TSA, set allowSkipTSA to true in the config.`
      );
    }
  }

  log("built zxp", true, output);
  return output;
};
