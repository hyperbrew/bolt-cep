<script lang="ts">
  import { onMount } from "svelte";
  import { fs, os, path } from "../lib/node";
  import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils";

  let count = 0;

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
    <img src="../assets/bolt-cep.svg" class="icon" alt="" />
    <div class="stack-icons">
      <div>
        <img src="../assets/vite.svg" alt="" />
        Vite
      </div>
      +
      <div>
        <img src="../assets/svelte.svg" alt="" />
        Svelte
      </div>
      +
      <div>
        <img src="../assets/typescript.svg" alt="" />
        TypeScript
      </div>
    </div>
    <div class="button-group">
      <button on:click={() => (count += 1)}>Count is: {count}</button>
      <button on:click={nodeTest}>
        <img class="icon-button" src="../assets/node-js.svg" alt="" />
      </button>
      <button on:click={jsxTest}>
        <img class="icon-button" src="../assets/adobe.svg" alt="" />
      </button>
    </div>

    <p>Edit <code>App.svelte</code> and save to test HMR updates.</p>
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
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  .app {
    text-align: center;
  }

  .app-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: white;
  }

  :global(.app-link) {
    color: #61dafb;
  }

  button {
    font-size: 1.25rem;
    background-color: #3f4653;
    padding: 0.5rem;
    text-align: center;
    vertical-align: middle;
    border-radius: 5px;
    color: white;
    border: none;
    outline: none;
  }

  button:hover {
    background-color: #515b6d;
  }

  button:active {
    background-color: #516d55;
  }

  .button-group {
    display: flex;
    row-gap: 1rem;
    column-gap: 1rem;
  }

  .stack-icons {
    display: flex;
    margin: 2rem 0rem 2rem 0rem;
    font-size: 2.5rem;
  }
  .stack-icons > div {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    font-size: 1rem;
    margin: 0rem 1rem 0rem 1rem;
  }
  .stack-icons img {
    margin: auto;
    display: block;
    height: 3rem;
    width: 3rem;
  }

  .icon {
    width: 250px;
    height: 250px;
  }

  .icon-button {
    width: 20px;
    height: 20px;
  }
</style>
