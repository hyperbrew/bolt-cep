import App from "./main.svelte";
import { initBolt } from "../lib/utils/bolt";

initBolt();

const app = new App({
  target: document.getElementById("root") as Element,
});

export default app;
