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

let main: any;

switch (BridgeTalk.appName as ApplicationName) {
  case "aftereffects":
  case "aftereffectsbeta":
    main = aeft;
    break;

  case "ame":
  case "amebeta":
    main = ame;
    break;

  case "audition":
  case "auditionbeta":
    main = audt;
    break;

  case "bridge":
  case "bridgebeta":
    main = kbrg;
    break;

  case "illustrator":
  case "illustratorbeta":
    main = ilst;
    break;

  case "indesign":
  case "indesignbeta":
    main = idsn;
    break;

  case "photoshop":
  case "photoshopbeta":
    main = phxs;
    break;

  case "premierepro":
  case "premiereprobeta":
    main = ppro;
    break;

  default:
    //@ts-ignore
    if (app.appName === "Adobe Animate") {
      main = anim;
    }
    break;
}

//@ts-ignore
const host = typeof $ !== "undefined" ? $ : window;
host[ns] = main;

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
