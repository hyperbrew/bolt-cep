import CSInterface from "../lib/csinterface";
import Vulcan, { VulcanMessage } from "../lib/vulcan";
import { ns } from "../../shared/shared";
import type { Scripts, ScriptNames } from "../../jsx/types";

export const csi = new CSInterface();
export const vulcan = new Vulcan();

export const openLinkInBrowser = (url: string) => {
  if (window.cep) {
    csi.openURLInDefaultBrowser(url);
  } else {
    location.href = url;
  }
};

export function evalExtendScript(script: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    csi.evalScript("try{" + script + "}catch(e){alert(e);}", (res: string) => {
      resolve(res);
    });
  });
}

function sanitizeExtendScriptArg(arg: any) {
  return typeof arg === "string" ? `"${arg}"` : arg;
}

export function evalFunction<ScriptName extends ScriptNames>(
  functionName: ScriptName,
  ...args: Parameters<Scripts[ScriptName]>
): Promise<string> {
  return new Promise(function (resolve, reject) {
    const pre = `var host = typeof $ !== 'undefined' ? $ : window; host["${ns}"].`;
    const functionCall = `${functionName}(${args
      .map(sanitizeExtendScriptArg)
      .join(", ")})`;
    const fullString = pre + functionCall;

    csi.evalScript(
      "try{" + fullString + "}catch(e){alert(e);}",
      (res: string) => {
        resolve(res);
      }
    );
  });
}

export const evalFile = (file: string) => {
  return evalExtendScript(
    "typeof $ !== 'undefined' ? $.evalFile(\"" +
      file +
      '") : fl.runScript(FLfile.platformPathToURI("' +
      file +
      '"));'
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

export const posix = (str: string) => str.replace(/\\/g, "/");
