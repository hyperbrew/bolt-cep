// For more details on Manifest Preferences see:
// https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md

type CEP_Host_Name =
  | "PHSP"
  | "PHXS"
  | "IDSN"
  | "AICY"
  | "ILST"
  | "PPRO"
  | "PRLD"
  | "AEFT"
  | "FLPR"
  | "AUDT"
  | "DRWV"
  | "KBRG"
  | "AME"
  | "MUSE"
  | "LTRM"
  | "DEMO"
  | "BRDG"
  | "RUSH";

type CEP_Host = {
  name: CEP_Host_Name;
  version: string;
};

export type JSXBIN_MODE = "off" | "copy" | "replace";

type CEF_Command =
  | "--enable-media-stream"
  | "--enable-speech-input"
  | "--enable-file-cookies"
  | "--enable-nodejs"
  | "--persist-session-cookies"
  | "--disable-image-loading"
  | "--disable-javascript-open-windows"
  | "--disable-javascript-close-windows"
  | "--disable-javascript-access-clipboard"
  | "--disable-site-isolation-trials"
  | "--enable-caret-browsing"
  | "--proxy-auto-detect"
  | "--user-agent"
  | "--disable-application-cache"
  | "--disable-pinch"
  | "--mixed-context"
  | "--allow-file-access"
  | "--allow-file-access-from-files"
  | "--disable-popup-blocking"
  | "--aggressive-cache-discard"
  | "--winhttp-proxy-resolver"
  | "--v=0"
  | "--v=1"
  | "--v=2"
  | "--v=3"
  | "--v=4"
  | "--v=5";

type CEP_Panel_Type =
  | "Panel"
  | "ModalDialog"
  | "Modeless"
  | "Custom"
  | "Embedded";

export interface CEP_Panel {
  mainPath: string;
  name: string;
  panelDisplayName?: string | null;
  autoVisible: boolean;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  scriptPath?: string;
  host?: string;
  type?: CEP_Panel_Type;
  id?: string;
  iconDarkNormal?: string;
  iconNormal?: string;
  iconDarkNormalRollOver?: string;
  iconNormalRollOver?: string;
  parameters?: CEF_Command[];
  startOnEvents?: string[];
}

export interface CEP_Extended_Panel extends CEP_Panel {
  id: string;
  parameters: CEF_Command[];
  type: CEP_Panel_Type;
}

export interface CEP_Config {
  port: number;
  servePort: number;
  symlink: "local" | "global";
  startingDebugPort: number;
  version: string;
  id: string;
  displayName: string;
  extensionManifestVersion: number;
  requiredRuntimeVersion: number;
  hosts: CEP_Host[];
  type: CEP_Panel_Type;
  iconDarkNormal?: string;
  iconNormal?: string;
  iconDarkNormalRollOver?: string;
  iconNormalRollOver?: string;
  parameters: CEF_Command[];
  scriptPath?: string;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  standalone?: boolean;

  panels: CEP_Panel[];

  build?: {
    sourceMap?: boolean;
    jsxBin?: JSXBIN_MODE;
  };
  zxp: {
    country: string;
    province: string;
    org: string;
    password: string;
    tsa?: string | string[];
    allowSkipTSA?: boolean;
    sourceMap?: boolean;
    jsxBin?: JSXBIN_MODE;
  };
  installModules?: string[];
  copyAssets?: string[];
  copyZipAssets?: string[];
}

export interface CEP_Config_Extended extends CEP_Config {
  panels: CEP_Extended_Panel[];
}
