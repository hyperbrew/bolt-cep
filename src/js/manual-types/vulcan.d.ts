export default class Vulcan {
  // TODO: FINISH TYPE DEFS
  getTargetSpecifiers: (...params: any) => {};
  launchApp: (...params: any) => {};
  isAppRunning: (...params: any) => {};
  isAppInstalled: (...params: any) => {};
  getAppPath: (...params: any) => {};
  addMessageListener: (...params: any) => {};
  removeMessageListener: (...params: any) => {};
  dispatchMessage: (...params: any) => {};
  getPayload: (...params: any) => {};
  getEndPoints: (...params: any) => {};
  getSelfEndPoint: (...params: any) => {};
  constructor();
}
export class VulcanMessage {
  type: string;
  scope: string;
  appId: string;
  appVersion: string;
  data: string;
  static TYPE_PREFIX: string;
  static SCOPE_SUITE: string;
  static DEFAULT_APP_ID: string;
  static DEFAULT_APP_VERSION: string;
  static DEFAULT_DATA: string;
  static dataTemplate: string;
  static payloadTemplate: string;

  initialize: (...params: any) => {};
  xmlData: (...params: any) => {};
  setPayload: (...params: any) => {};
  getPayload: (...params: any) => {};
  toString: (...params: any) => {};
  constructor(
    type: string | null,
    appId: string | null,
    appVersion: string | null
  );
}
