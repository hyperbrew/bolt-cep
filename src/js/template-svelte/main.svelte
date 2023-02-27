<script lang="ts">
  import { onMount } from "svelte";
  import { os, path } from "../lib/cep/node";
  import {
    csi,
    evalES,
    evalFile,
    openLinkInBrowser,
    subscribeBackgroundColor,
    evalTS,
  } from "../lib/utils/bolt";

  import viteLogo from "../assets/vite.svg";
  import svelteLogo from "../assets/svelte.svg";
  import tsLogo from "../assets/typescript.svg";
  import sassLogo from "../assets/sass.svg";

  import nodeJs from "../assets/node-js.svg";
  import adobe from "../assets/adobe.svg";
  import bolt from "../assets/bolt-cep.svg";

  import "../index.scss";
  import "./main.scss";

  let count: number = 0;
  let backgroundColor: string = "#282c34";

  //* Demonstration of Traditional string eval-based ExtendScript Interaction
  const jsxTest = () => {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
  };

  //* Demonstration of End-to-End Type-safe ExtendScript Interaction
  const jsxTestTS = () => {
    evalTS("helloStr", "test").then((res) => {
      console.log(res);
    });
    evalTS("helloNum", 1000).then((res) => {
      console.log(typeof res, res);
    });
    evalTS("helloArrayStr", ["ddddd", "aaaaaa", "zzzzzzz"]).then((res) => {
      console.log(typeof res, res);
    });
    evalTS("helloObj", { height: 90, width: 100 }).then((res) => {
      console.log(typeof res, res);
      console.log(res.x);
      console.log(res.y);
    });
    evalTS("helloError", "test").catch((e) => {
      console.log("there was an error", e);
    });
  };

  const nodeTest = () => {
    alert(
      `Node.js ${process.version}\nPlatform: ${
        os.platform
      }\nFolder: ${path.basename(window.cep_node.global.__dirname)}`
    );
  };

  onMount(() => {
    if (window.cep) {
      subscribeBackgroundColor((c: string) => (backgroundColor = c));
    }
  });
</script>

<div class="app" style="background-color: {backgroundColor};">
  <header class="app-header">
    <img src={bolt} class="icon" alt="" />
    <div class="stack-icons">
      <div>
        <img src={viteLogo} alt="" />
        Vite
      </div>
      +
      <div>
        <img src={svelteLogo} alt="" />
        Svelte
      </div>
      +
      <div>
        <img src={tsLogo} alt="" />
        TypeScript
      </div>
      +
      <div>
        <img src={sassLogo} alt="" />
        Sass
      </div>
    </div>
    <div class="button-group">
      <button on:click={() => (count += 1)}>Count is: {count}</button>
      <button on:click={nodeTest}>
        <img class="icon-button" src={nodeJs} alt="" />
      </button>
      <button on:click={jsxTest}>
        <img class="icon-button" src={adobe} alt="" />
      </button>
      <button on:click={jsxTestTS}>Ts</button>
    </div>

    <p>Edit <code>main.svelte</code> and save to test HMR updates.</p>
    <p>
      <button
        on:click={() =>
          openLinkInBrowser("https://github.com/hyperbrew/bolt-cep")}
      >
        Bolt Docs
      </button>
      |
      <button on:click={() => openLinkInBrowser("https://svelte.dev/docs")}>
        Svelte Docs
      </button>
      |
      <button
        on:click={() =>
          openLinkInBrowser("https://vitejs.dev/guide/features.html")}
      >
        Vite Docs
      </button>
    </p>
  </header>
</div>

<style>
</style>
