export default class CSInterface {
  hostEnvironment: {
    appName: string;
    appVersion: string;
    appLocale: string;
    appUILocale: string;
    appId: string;
    isAppOnline: string;
    appSkinInfo: {
      panelBackgroundColor: {
        baseFontFamily: string;
        baseFontSize: string;
        appBarBackgroundColor: string;
        panelBackgroundColor: string;
        appBarBackgroundColorSRGB: string;
        panelBackgroundColorSRGB: string;
        systemHighlightColor: string;
      };
    };
  };
  resizeContent: (width: number, height: number) => {};
  registerInvalidCertificateCallback: (callback: Function) => {};
  registerKeyEventsInterest: (
    jsonArray: [
      {
        keyCode: number;
        ctrlKey?: boolean;
        metaKey?: boolean;
        shiftKey?: boolean;
        altKey?: boolean;
      }
    ]
  ) => {};
  setWindowTitle: (title: string) => {};
  getWindowTitle: () => {};

  // TODO: FINISH TYPE DEFS

  getHostEnvironment: (...params: any) => {};
  loadBinAsync: (...params: any) => {};
  loadBinSync: (...params: any) => {};
  closeExtension: (...params: any) => {};
  getSystemPath: (...params: any) => {};
  evalScript: (...params: any) => {};
  getApplicationID: (...params: any) => {};
  getHostCapabilities: (...params: any) => {};
  dispatchEvent: (...params: any) => {};
  addEventListener: (...params: any) => {};
  removeEventListener: (...params: any) => {};
  requestOpenExtension: (...params: any) => {};
  getExtensions: (...params: any) => {};
  getNetworkPreferences: (...params: any) => {};
  initResourceBundle: (...params: any) => {};
  dumpInstallationInfo: (...params: any) => {};
  getOSInformation: (...params: any) => {};
  openURLInDefaultBrowser: (...params: any) => {};
  getExtensionID: (...params: any) => {};
  getScaleFactor: (...params: any) => {};
  getMonitorScaleFactor: (...params: any) => {};
  setScaleFactorChangedHandler: (...params: any) => {};
  getCurrentApiVersion: (...params: any) => {};
  setPanelFlyoutMenu: (...params: any) => {};
  updatePanelMenuItem: (...params: any) => {};
  setContextMenu: (...params: any) => {};
  setContextMenuByJSON: (...params: any) => {};
  updateContextMenuItem: (...params: any) => {};
  isWindowVisible: (...params: any) => {};
  constructor();
}
