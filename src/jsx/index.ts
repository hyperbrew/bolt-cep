// @include './lib/json2.js'

import { ns } from "../shared/shared";

import * as aeft from "./aeft/aeft";
import * as ame from "./ame/ame";
import * as anim from "./anim/anim";
import * as audt from "./audt/audt";
import * as idsn from "./idsn/idsn";
import * as ilst from "./ilst/ilst";
import * as kbrg from "./kbrg/kbrg";
import * as phxs from "./phxs/phxs";
import * as ppro from "./ppro/ppro";

//@ts-ignore
const host = typeof $ !== "undefined" ? $ : window;

// A safe way to get the app name since some versions of Adobe Apps broken BridgeTalk in various places (e.g. After Effects 24-25)
// in that case we have to do various checks per app to deterimine the app name

const getAppNameSafely = (): ApplicationName | "unknown" => {
  const compare = (a: string, b: string) => {
    return a.toLowerCase().indexOf(b.toLowerCase()) > -1;
  };
  const exists = (a: any) => typeof a !== "undefined";
  const isBridgeTalkWorking =
    typeof BridgeTalk !== "undefined" &&
    typeof BridgeTalk.appName !== "undefined";

  if (isBridgeTalkWorking) {
    return BridgeTalk.appName;
  } else if (app) {
    //@ts-ignore
    if (exists(app.name)) {
      //@ts-ignore
      const name: string = app.name;
      if (compare(name, "photoshop")) return "photoshop";
      if (compare(name, "illustrator")) return "illustrator";
      if (compare(name, "audition")) return "audition";
      if (compare(name, "bridge")) return "bridge";
      if (compare(name, "indesign")) return "indesign";
    }
    //@ts-ignore
    if (exists(app.appName)) {
      //@ts-ignore
      const appName: string = app.appName;
      if (compare(appName, "after effects")) return "aftereffects";
      if (compare(appName, "animate")) return "animate";
    }
    //@ts-ignore
    if (exists(app.path)) {
      //@ts-ignore
      const path = app.path;
      if (compare(path, "premiere")) return "premierepro";
    }
    //@ts-ignore
    if (exists(app.getEncoderHost) && exists(AMEFrontendEvent)) {
      return "ame";
    }
  }
  return "unknown";
};

switch (getAppNameSafely()) {
  case "aftereffects":
  case "aftereffectsbeta":
    host[ns] = aeft;
    break;

  case "ame":
  case "amebeta":
    host[ns] = ame;
    break;

  case "audition":
  case "auditionbeta":
    host[ns] = audt;
    break;

  case "bridge":
  case "bridgebeta":
    host[ns] = kbrg;
    break;

  case "illustrator":
  case "illustratorbeta":
    host[ns] = ilst;
    break;

  case "indesign":
  case "indesignbeta":
    host[ns] = idsn;
    break;

  case "photoshop":
  case "photoshopbeta":
    host[ns] = phxs;
    break;

  case "premierepro":
  case "premiereprobeta":
    host[ns] = ppro;
    break;

  case "animate":
  case "animatebeta":
    host[ns] = anim;
    break;
}

export type Scripts = typeof aeft &
  typeof ame &
  typeof anim &
  typeof audt &
  typeof idsn &
  typeof ilst &
  typeof kbrg &
  typeof phxs &
  typeof ppro;

// https://extendscript.docsforadobe.dev/interapplication-communication/bridgetalk-class.html?highlight=bridgetalk#appname
type ApplicationName =
  | "aftereffects"
  | "aftereffectsbeta"
  | "ame"
  | "amebeta"
  | "audition"
  | "auditionbeta"
  | "animate"
  | "animatebeta"
  | "bridge"
  | "bridgebeta"
  // | "flash"
  | "illustrator"
  | "illustratorbeta"
  | "indesign"
  | "indesignbeta"
  // | "indesignserver"
  | "photoshop"
  | "photoshopbeta"
  | "premierepro"
  | "premiereprobeta";
