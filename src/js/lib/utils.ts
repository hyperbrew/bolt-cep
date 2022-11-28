import CSInterface from "../lib/csinterface";
import Vulcan, { VulcanMessage } from "../lib/vulcan";
import type { Scripts } from "../../jsx/index";
import { ns } from "../../shared/shared";

export const csi = new CSInterface();
export const vulcan = new Vulcan();

export const openLinkInBrowser = (url: string) => {
  if (window.cep) {
    csi.openURLInDefaultBrowser(url);
  } else {
    location.href = url;
  }
};

export const evalES = (script: string, isGlobal = false): Promise<string> => {
  return new Promise(function (resolve, reject) {
    const pre = isGlobal
      ? ""
      : `var host = typeof $ !== 'undefined' ? $ : window; host["${ns}"].`;
    const fullString = pre + script;
    csi.evalScript(
      "try{" + fullString + "}catch(e){alert(e);}",
      (res: string) => {
        resolve(res);
      }
    );
  });
};

function sanitizeExtendScriptArg(arg: any) {
  return typeof arg === "string" ? JSON.stringify(arg) : arg;
}

export function evalFunction<ScriptName extends keyof Scripts>(
  functionName: ScriptName,
  ...args: Parameters<Scripts[ScriptName]>
): Promise<ReturnType<Scripts[ScriptName]>> {
  return new Promise(function (resolve, reject) {
    const argsString = args.map(sanitizeExtendScriptArg).join(", ");

    const fullString = `
var host = typeof $ !== 'undefined' ? $ : window;
var namespace = host["${ns}"];
if (namespace) {
  namespace.${functionName}(${argsString});
} else {
  write("Namespace ${ns} not found");
}
`.trim();
    csi.evalScript(
      `try {
  ${fullString}
} catch(e) {
  alert("Error in function '${functionName}'\\n" + "Error message: " + e.message + "\\n" + 'Call: ${functionName}(${argsString})');
}`,
      (res: any) => {
        resolve(res);
      }
    );
  });
}

export const evalFile = (file: string) => {
  return evalES(
    "typeof $ !== 'undefined' ? $.evalFile(\"" +
      file +
      '") : fl.runScript(FLfile.platformPathToURI("' +
      file +
      '"));',
    true
  );
};

export const getAppBackgroundColor = () => {
  const { green, blue, red } = JSON.parse(
    window.__adobe_cep__.getHostEnvironment() as string
  ).appSkinInfo.panelBackgroundColor.color;
  return {
    rgb: {
      r: red,
      g: green,
      b: blue,
    },
    hex: `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`,
  };
};

export const subscribeBackgroundColor = (callback: (color: string) => void) => {
  const getColor = () => {
    const newColor = getAppBackgroundColor();
    console.log("BG Color Updated: ", { rgb: newColor.rgb });
    const { r, g, b } = newColor.rgb;
    return `rgb(${r}, ${g}, ${b})`;
  };
  // get current color
  callback(getColor());
  // listen for changes
  csi.addEventListener(
    "com.adobe.csxs.events.ThemeColorChanged",
    () => callback(getColor()),
    {}
  );
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

export const isAppRunning = (targetSpecifier: string) => {
  const { major, minor, micro } = csi.getCurrentApiVersion();
  const version = parseFloat(`${major}.${minor}`);
  if (version >= 11.2) {
    return vulcan.isAppRunningEx(targetSpecifier.toUpperCase());
  } else {
    return vulcan.isAppRunning(targetSpecifier);
  }
};
