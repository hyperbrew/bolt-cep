import CSInterface from "../lib/csinterface";
import Vulcan, { VulcanMessage } from "../lib/vulcan";
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

export const posix = (str: string) => str.replace(/\\/g, "/");

let rootBound = false;

export const spectrumBindMac = (tag: string) => {
  const isMac = navigator.appVersion.indexOf("Macintosh") > -1;
  const matches = navigator.appVersion.match(/Chrome\/([0-9]*)/);
  if (isMac && matches) {
    const chromeVersion = parseInt(matches[0].replace("Chrome/", ""));
    // was fixed in 62, but broken again in 72 ...
    if (chromeVersion < 162 /* fixedVersion */) {
      const simulateClick = (e: any) => {
        // console.log('clicked')
        const elem = e.target as HTMLElement;
        const clickableItems = ["BUTTON", "DIV"];
        if (clickableItems.indexOf(elem.tagName) > -1) {
          elem.click();
        } else if (
          elem.parentElement &&
          clickableItems.indexOf(elem.parentElement.tagName) > -1
        ) {
          elem.parentElement.click();
        }
      };
      if (tag === "root" && rootBound !== true) {
        rootBound = true;
        console.log("ROOT BOUND");
        document
          .getElementById("root")
          ?.removeEventListener("click", simulateClick);
        document
          .getElementById("root")
          ?.addEventListener("click", simulateClick);
      } else if (tag === "dropdown") {
        console.log("DROPDOWN BOUND");
        document
          .getElementsByClassName("spectrum-Dropdown-popover")[0]
          ?.removeEventListener("click", simulateClick);
        document
          .getElementsByClassName("spectrum-Dropdown-popover")[0]
          ?.addEventListener("click", simulateClick);
      }
    }
  }
};
