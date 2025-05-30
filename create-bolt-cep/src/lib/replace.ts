import * as fs from "fs-extra";

export const replaceInFile = (
  fullPath: string,
  items: [findStr: string | RegExp, replaceStr: string][]
) => {
  const fileIn = fs.readFileSync(fullPath, { encoding: "utf-8" });
  fs.unlinkSync(fullPath);
  let fileOut = fileIn;
  items.map((item) => {
    fileOut = fileOut.replaceAll(item[0], item[1]);
  });
  fs.writeFileSync(fullPath, fileOut, { encoding: "utf-8" });
};
