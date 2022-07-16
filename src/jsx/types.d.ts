import * as aeft from "./aeft/aeft";
import * as ilst from "./ilst/ilst";
import * as anim from "./anim/anim";
import * as ppro from "./ppro/ppro";
import * as phxs from "./phxs/phxs";

export type Scripts = typeof aeft &
  typeof ilst &
  typeof anim &
  typeof ppro &
  typeof phxs;

export type ScriptNames = keyof Scripts;
