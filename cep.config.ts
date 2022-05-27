import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";
// import { debugAll } from "./cep.config.debug"; // DEBUG-ONLY

const config: CEP_Config = {
  version,
  id: "com.bolt.cep",
  displayName: "Bolt CEP",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [
    {
      name: "AEFT",
      version: "[0.0,99.9]",
    },
    {
      name: "PPRO",
      version: "[0.0,99.9]",
    },
    {
      name: "FLPR",
      version: "[0.0,99.9]",
    },
  ],

  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "Bolt CEP",
      autoVisible: true,
      width: 600,
      height: 650,
    },
    // ...debugAll, // DEBUG-ONLY
  ],

  build: {
    jsxBin: "copy",
    sourceMap: true,
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "MyCompany",
    password: "mypassword",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "replace",
  },
  installModules: [],
  copyAssets: [],
};
export default config;
