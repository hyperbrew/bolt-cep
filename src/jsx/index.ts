// @include './lib/json2.js'

import { ns } from "../shared/shared";

import * as aeft from "./aeft/aeft";
import * as ilst from "./ilst/ilst";
import * as anim from "./anim/anim";
import * as ppro from "./ppro/ppro";
import * as phxs from "./phxs/phxs";

let main: any;

switch (BridgeTalk.appName) {
  case "premierepro":
    main = ppro;
    break;
  case "aftereffects":
    main = aeft;
    break;
  case "illustrator":
    main = ilst;
    break;
  case "photoshop":
    main = phxs;
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

const mainObj = {
  aeft,
  ilst,
  anim,
  ppro,
  phxs,
};
type esType = typeof mainObj;

export default esType;
