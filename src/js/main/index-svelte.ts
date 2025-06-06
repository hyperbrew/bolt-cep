import App from "./main.svelte";
import { initBolt } from "../lib/utils/bolt";
import { mount } from "svelte";

initBolt();

mount(App, {
  target: document.getElementById("app")!,
});
