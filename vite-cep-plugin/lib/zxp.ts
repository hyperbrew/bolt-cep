import * as os from "os";
import * as path from "path";
import { execSync } from "child_process";

import { removeIfExists, safeCreate, log } from "./lib";
import { CEP_Config } from "../cep-config";
import * as fs from "fs";

const { existsSync } = fs;

export const signZXP = (config: CEP_Config, input: string, zxpDir: string) => {
  const zxpCmd = os.platform() == "win32" ? `ZXPSignCmd` : `./ZXPSignCmd`;
  const name = config.id;
  const data = config.zxp;
  const output = path.join(zxpDir, `${name}.zxp`);
  const certPath = `${name}-cert.p12`;

  const signPrepStr = `${zxpCmd} -selfSignedCert ${data.country} ${data.province} ${data.org} ${name} ${data.password} ${certPath}`;
  const signStr = `${zxpCmd} -sign "${input}" "${output}" ${certPath} ${data.password} -tsa ${data.tsa}`;
  const cwdDir = path.join(__dirname, "..", "bin");

  removeIfExists(output);
  safeCreate(zxpDir);
  execSync(signPrepStr, { cwd: cwdDir, encoding: "utf-8" });
  execSync(signStr, { cwd: cwdDir, encoding: "utf-8" });
  log("built zxp", true, output);
};
