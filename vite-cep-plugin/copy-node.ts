import path from "path";
import fs from "fs-extra";

export const unique = (array) => {
  return array.filter((v, i, a) => a.indexOf(v) === i);
};

const nodeSolve = ({ src, pkg, keepDevDependencies }) => {
  let allDependencies = [pkg];
  const fullPath = path.join(src, "node_modules", pkg);
  // console.log(`getting pkgs for ${fullPath}`);
  const pkgJson = path.join(fullPath, "package.json");
  if (fs.existsSync(pkgJson)) {
    const raw = fs.readFileSync(pkgJson, { encoding: "utf-8" });
    const json = JSON.parse(raw);
    let { dependencies, devDependencies } = json;
    const depList = dependencies ? Object.keys(dependencies) : [];
    const devDepList = devDependencies ? Object.keys(devDependencies) : [];
    const resDepList = keepDevDependencies
      ? depList.concat(devDepList)
      : depList;
    if (resDepList.length > 0) {
      allDependencies = allDependencies.concat(resDepList);
      resDepList.map((name) => {
        allDependencies = allDependencies.concat(
          nodeSolve({ src, pkg: name, keepDevDependencies })
        );
      });
    }
  }
  return allDependencies || [];
};

export const copyModules = ({ packages, src, dest, symlink }) => {
  const allPkg = packages.flatMap((pkg) =>
    nodeSolve({ src, pkg, keepDevDependencies: false })
  );
  const uniqePkg = unique(allPkg);
  console.log(
    `Copying ${packages.length} Node Module(s) (${
      uniqePkg.length
    } Dependencies) : ${packages.join(",")}`
  );
  fs.ensureDirSync(path.join(dest, "node_modules"));
  uniqePkg.map((pkg) => {
    const fullSrcPath = path.join(process.cwd(), src, "node_modules", pkg);
    const fullDstPath = path.join(process.cwd(), dest, "node_modules", pkg);
    fs.ensureDirSync(path.dirname(fullDstPath));
    if (!symlink) {
      fs.copySync(fullSrcPath, fullDstPath);
    } else {
      fs.ensureSymlink(fullSrcPath, fullDstPath, "dir");
    }
  });
};

const rollupNodeCopyPlugin = ({ packages, src, dest, symlink }) => {
  return {
    name: "copy-node-modules",
    buildEnd: async () => {
      copyModules({ packages, src, dest, symlink });
    },
  };
};

export default rollupNodeCopyPlugin;
