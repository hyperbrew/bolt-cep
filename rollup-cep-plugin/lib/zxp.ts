import os from "os";
import path from "path";
import { execSync } from "child_process";

import { removeIfExists, safeCreate, log } from "./lib";

export const signZXP = (config: any, input: string, zxpDir: string) => {
  const zxpCmd = os.platform() == "win32" ? `ZXPSignCmd` : `./ZXPSignCmd`;
  const data = config.zxp;
  const output = path.join(zxpDir, `${data.name}.zxp`);
  const certPath = `${data.name}-cert.p12`;

  const signPrepStr = `${zxpCmd} -selfSignedCert ${data.country} ${data.province} ${data.org} ${data.name} ${data.password} ${certPath}`;
  const signStr = `${zxpCmd} -sign "${input}" "${output}" ${certPath} ${data.password} -tsa ${data.tsa}`;
  const cwdDir = path.join(__dirname, "rollup-cep-plugin", "bin");

  removeIfExists(output);
  safeCreate(zxpDir);
  execSync(signPrepStr, { cwd: cwdDir, encoding: "utf-8" });
  execSync(signStr, { cwd: cwdDir, encoding: "utf-8" });
  log("built zxp", true, output);
};
