//@ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

const src = path.join(process.cwd(), "src", "bin");
const dst = path.join(process.cwd(), "lib", "bin");
fs.ensureDirSync(dst);
fs.copySync(src, dst);
