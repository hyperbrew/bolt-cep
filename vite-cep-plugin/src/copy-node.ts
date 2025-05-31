import * as path from "path";
import * as fs from "fs-extra";

export const unique = (array: any) => {
  return array.filter((v: string, i: number, a: string) => a.indexOf(v) === i);
};

interface NodeSolveArgs {
  src: string;
  pkg: string;
  keepDevDependencies: boolean;
}

const nodeSolve = ({ src, pkg, keepDevDependencies }: NodeSolveArgs) => {
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

interface CopyModulesArgs {
  packages: string[];
  src: string;
  dest: string;
  symlink: boolean;
}

export const copyModules = ({
  packages,
  src,
  dest,
  symlink,
}: CopyModulesArgs) => {
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
  uniqePkg.map((pkg: string) => {
    const fullSrcPath = path.join(process.cwd(), src, "node_modules", pkg);
    const fullDstPath = path.join(process.cwd(), dest, "node_modules", pkg);
    fs.ensureDirSync(path.dirname(fullDstPath));
    if (!symlink) {
      fs.copySync(fullSrcPath, fullDstPath, {dereference: true});
    } else {
      fs.ensureSymlink(fullSrcPath, fullDstPath, "dir");
    }
  });
};

interface CopyFilesArgs {
  src: string;
  dest: string;
  assets: string[];
}

export const copyFiles = ({ src, dest, assets }: CopyFilesArgs) => {
  console.log(`Copying ${assets.length} Assets`);
  // fs.ensureDirSync(path.join(dest, "node_modules"));
  assets.map((asset: string) => {
    const fullSrcPath = path.join(src, asset);
    if (asset.indexOf("/*") === asset.length - 2) {
      // flatten folder
      const folder = asset.substring(0, asset.length - 2);
      const files = fs.readdirSync(path.join(src, folder));

      files.map((file) => {
        const fullSrcPath = path.join(src, folder, file);
        const fullDstPath = path.join(dest, file);
        console.log(`COPY ${fullSrcPath} to ${fullDstPath}`);
        fs.ensureDirSync(path.dirname(fullDstPath));
        fs.copySync(fullSrcPath, fullDstPath);
      });
    } else {
      const fullDstPath = path.join(dest, asset);
      console.log(`COPY ${fullSrcPath} to ${fullDstPath}`);
      fs.ensureDirSync(path.dirname(fullDstPath));
      fs.copySync(fullSrcPath, fullDstPath);
    }
  });
};

const rollupNodeCopyPlugin = ({
  packages,
  src,
  dest,
  symlink,
}: CopyModulesArgs) => {
  return {
    name: "copy-node-modules",
    buildEnd: async () => {
      copyModules({ packages, src, dest, symlink });
    },
  };
};

export default rollupNodeCopyPlugin;
