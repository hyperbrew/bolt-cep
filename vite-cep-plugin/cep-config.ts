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
  | "RUSH";

type CEP_Host = {
  name: CEP_Host_Name;
  version: string;
};

type CEF_Command =
  | "--enable-media-stream"
  | "--enable-speech-input"
  | "--persist-session-cookies"
  | "--disable-image-loading"
  | "--disable-javascript-open-windows"
  | "--disable-javascript-close-windows"
  | "--disable-javascript-access-clipboard"
  | "--enable-caret-browsing"
  | "--proxy-auto-detect"
  | "--user-agent"
  | "--disable-application-cache"
  | "--enable-nodejs"
  | "--disable-pinch"
  | "--mixed-context";

type CEP_Panel_Type = "Panel" | "ModalDialog" | "Modeless" | "Custom";

export interface CEP_Panel {
  mainPath: string;
  name: string;
  panelDisplayName: string;
  autoVisible: boolean;
  width?: number;
  height?: number;
}

export interface CEP_Extended_Panel extends CEP_Panel {
  id: string;
  iconDarkNormal?: string;
  iconNormal?: string;
  iconDarkNormalRollOver?: string;
  iconNormalRollOver?: string;
  parameters: CEF_Command[];
  type: CEP_Panel_Type;
  width?: number;
  height?: number;
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
  scriptPath: string;
  width?: number;
  height?: number;

  panels: CEP_Panel[];

  zxp: {
    country: string;
    province: string;
    org: string;
    password: string;
    tsa: string;
  };
  installModules?: string[];
}
