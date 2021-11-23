import CSInterface from "../lib/csinterface";
import Vulcan, { VulcanMessage } from "../lib/vulcan";
import { ns } from "../../shared/shared";

export const csi = new CSInterface();
export const vulcan = new Vulcan();
//@ts-ignore
export const cep_node: ICEP_Node = cep_node;
//@ts-ignore
export const cep: ICEP = cep_node;

export const evalES = (script: string, isGlobal = false): Promise<string> => {
  return new Promise(function (resolve, reject) {
    csi.evalScript(
      `try{
        ${
          isGlobal
            ? ""
            : `var host = typeof $ !== 'undefined' ? $ : window; host["${ns}"].`
        }${script};
      }catch(e){
        alert(e);
      }`,
      (res: string) => {
        resolve(res);
      }
    );
  });
};

export const evalFile = (file: string) => {
  return evalES(
    `typeof $ !== 'undefined' ?
    $.evalFile("${file}") :
    fl.runScript(FLfile.platformPathToURI("${file}"));`,
    true
  );
};

export const getAppBackgroundColor = () => {
  const { green, blue, red } =
    csi.hostEnvironment.appSkinInfo.panelBackgroundColor.color;
  return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
};
declare type IVulcanMessageObject = {
  event: string;
  callbackID?: string;
  data?: string | null;
  payload?: object;
};

export const vulcanSend = (id: string, msgObj: IVulcanMessageObject) => {
  const msg = new VulcanMessage(VulcanMessage.TYPE_PREFIX + id, null, null);
  const msgStr = JSON.stringify(msgObj);
  msg.setPayload(msgStr);
  vulcan.dispatchMessage(msg);
};

export const vulcanListen = (id: string, callback: Function) => {
  vulcan.addMessageListener(
    VulcanMessage.TYPE_PREFIX + id,
    (res: any) => {
      var msgStr = vulcan.getPayload(res);
      const msgObj = JSON.parse(msgStr);
      callback(msgObj);
    },
    null
  );
};

declare class ICEP_Node {
  global: any;
  process: any;
  buffer: any;
  require: any;
}
declare class ICEP {
  encoding: {
    Base64: "Base64" | string;
    UTF8: "UTF-8" | string;
    convertion: {
      utf8_to_b64: (...params: any) => {};
      b64_to_utf8: (...params: any) => {};
      binary_to_b64: (...params: any) => {};
      b64_to_binary: (...params: any) => {};
      ascii_to_b64: (...params: any) => {};
    };
  };
  fs: {
    ERR_CANT_READ: number;
    ERR_CANT_WRITE: number;
    ERR_FILE_EXISTS: number;
    ERR_INVALID_PARAMS: number;
    ERR_NOT_DIRECTORY: number;
    ERR_NOT_FILE: number;
    ERR_NOT_FOUND: number;
    ERR_OUT_OF_SPACE: number;
    ERR_UNKNOWN: number;
    ERR_UNSUPPORTED_ENCODING: number;
    NO_ERROR: number;
    chmod: (...params: any) => {};
    deleteFile: (...params: any) => {};
    makedir: (...params: any) => {};
    readFile: (...params: any) => {};
    readdir: (...params: any) => {};
    rename: (...params: any) => {};
    showOpenDialog: (...params: any) => {};
    showOpenDialogEx: (...params: any) => {};
    showSaveDialogEx: (...params: any) => {};
    stat: (...params: any) => {};
    writeFile: (...params: any) => {};
  };
  process: {
    ERR_EXCEED_MAX_NUM_PROCESS: number;
    createProcess: (...params: any) => {};
    getWorkingDirectory: (...params: any) => {};
    isRunning: (...params: any) => {};
    onquit: (...params: any) => {};
    stderr: (...params: any) => {};
    stdin: (...params: any) => {};
    stdout: (...params: any) => {};
    terminate: (...params: any) => {};
    waitfor: (...params: any) => {};
  };
  util: {
    DEPRECATED_API: number;
    ERR_INVALID_URL: number;
    openURLInDefaultBrowser: (...params: any) => {};
    registerExtensionUnloadCallback: (...params: any) => {};
    storeProxyCredentials: (...params: any) => {};
  };
}
