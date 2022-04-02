import { CEP_Config } from "vite-cep-plugin";

const config: CEP_Config = {
  port: 3000,
  servePort: 5000,
  symlink: "local",
  startingDebugPort: 8860,
  version: "1.0.0",
  id: "com.bolt.cep",
  displayName: "Bolt CEP",
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
