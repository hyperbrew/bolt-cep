// @include './lib/json2.js'

import { ns } from "../shared/shared";

import * as aeft from "./aeft/aeft"; // BOLT_AEFT_ONLY
import * as ame from "./ame/ame"; // BOLT_AME_ONLY
import * as anim from "./anim/anim"; // BOLT_ANIM_ONLY
import * as audt from "./audt/audt"; // BOLT_AUDT_ONLY
import * as idsn from "./idsn/idsn"; // BOLT_IDSN_ONLY
import * as ilst from "./ilst/ilst"; // BOLT_ILST_ONLY
import * as kbrg from "./kbrg/kbrg"; // BOLT_KBRG_ONLY
import * as phxs from "./phxs/phxs"; // BOLT_PHXS_ONLY
import * as ppro from "./ppro/ppro"; // BOLT_PPRO_ONLY

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
  // BOLT_AEFT_START
  case "aftereffects":
  case "aftereffectsbeta":
    host[ns] = aeft;
    break;
  // BOLT_AEFT_END

  // BOLT_AME_START
  case "ame":
  case "amebeta":
    host[ns] = ame;
    break;
  // BOLT_AME_END

  // BOLT_ANIM_START
  case "animate":
  case "animatebeta":
    host[ns] = anim;
    break;
  // BOLT_ANIM_END

  // BOLT_AUDT_START
  case "audition":
  case "auditionbeta":
    host[ns] = audt;
    break;
  // BOLT_AUDT_END

  // BOLT_IDSN_START
  case "indesign":
  case "indesignbeta":
    host[ns] = idsn;
    break;
  // BOLT_IDSN_END

  // BOLT_ILST_START
  case "illustrator":
  case "illustratorbeta":
    host[ns] = ilst;
    break;
  // BOLT_ILST_END

  // BOLT_KBRG_START
  case "bridge":
  case "bridgebeta":
    host[ns] = kbrg;
    break;
  // BOLT_KBRG_END

  // BOLT_PHXS_START
  case "photoshop":
  case "photoshopbeta":
    host[ns] = phxs;
    break;
  // BOLT_PHXS_END

  // BOLT_PPRO_START
  case "premierepro":
  case "premiereprobeta":
    host[ns] = ppro;
    break;
  // BOLT_PPRO_END
}

const empty = {};
// prettier-ignore
export type Scripts = typeof empty
  & typeof aeft // BOLT_AEFT_ONLY
  & typeof ame // BOLT_AME_ONLY
  & typeof anim // BOLT_ANIM_ONLY
  & typeof audt // BOLT_AUDT_ONLY
  & typeof idsn // BOLT_IDSN_ONLY
  & typeof ilst // BOLT_ILST_ONLY
  & typeof kbrg // BOLT_KBRG_ONLY
  & typeof phxs // BOLT_PHXS_ONLY
  & typeof ppro // BOLT_PPRO_ONLY
  ;

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
