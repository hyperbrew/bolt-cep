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

switch (BridgeTalk.appName as ApplicationName) {
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

  default:
    //@ts-ignore
    if (app.appName === "Adobe Animate") {
      host[ns] = anim;
    }
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
