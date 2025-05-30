var fs = require("fs-extra");
var path = require("path");
var src = path.join(process.cwd(), "src", "bin");
var dst = path.join(process.cwd(), "lib", "bin");
fs.ensureDirSync(dst);
fs.copySync(src, dst);
