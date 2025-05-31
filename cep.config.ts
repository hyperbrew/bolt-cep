import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";

const config: CEP_Config = {
  version,
  id: "com.bolt.cep", // BOLT_ID_REPLACE
  displayName: "Bolt CEP", // BOLT_DISPLAYNAME_REPLACE
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [
    { name: "AEFT", version: "[0.0,99.9]" }, // BOLT_AEFT_ONLY
    { name: "AME", version: "[0.0,99.9]" }, // BOLT_AME_ONLY
    { name: "FLPR", version: "[0.0,99.9]" }, // BOLT_ANIM_ONLY
    { name: "AUDT", version: "[0.0,99.9]" }, // BOLT_AUDT_ONLY
    { name: "IDSN", version: "[0.0,99.9]" }, // BOLT_IDSN_ONLY
    { name: "ILST", version: "[0.0,99.9]" }, // BOLT_ILST_ONLY
    { name: "KBRG", version: "[0.0,99.9]" }, // BOLT_KBRG_ONLY
    { name: "PHXS", version: "[0.0,99.9]" }, // BOLT_PHXS_ONLY
    { name: "PPRO", version: "[0.0,99.9]" }, // BOLT_PPRO_ONLY
  ],

  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "Bolt CEP", // BOLT_DISPLAYNAME_REPLACE
      autoVisible: true,
      width: 600,
      height: 650,
    },
  ],
  build: {
    jsxBin: "off",
    sourceMap: true,
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "Company",
    password: "password",
    tsa: [
      "http://timestamp.digicert.com/", // Windows Only
      "http://timestamp.apple.com/ts01", // MacOS Only
    ],
    allowSkipTSA: false,
    sourceMap: false,
    jsxBin: "off",
  },
  installModules: [],
  copyAssets: [],
  copyZipAssets: ["src/zip-assets/*"],
};
export default config;
