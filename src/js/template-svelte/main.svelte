<script lang="ts">
  import { onMount } from "svelte";
  import { fs, os, path } from "../lib/node";
  import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils";

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

  const jsxTest = () => {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
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
      const extRoot = csi.getSystemPath("extension");
      const jsxSrc = `${extRoot}/jsx/index.js`;
      const jsxBinSrc = `${extRoot}/jsx/index.jsxbin`;
      if (fs.existsSync(jsxSrc)) {
        console.log(jsxSrc);
        evalFile(jsxSrc);
      } else if (fs.existsSync(jsxBinSrc)) {
        console.log(jsxBinSrc);
        evalFile(jsxBinSrc);
      }
    }
  });
</script>

<div class="app">
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
