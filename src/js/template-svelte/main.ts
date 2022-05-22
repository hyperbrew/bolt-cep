import App from "./main.svelte";

const app = new App({
  target: document.getElementById("app") as Element,
});

export default app;
