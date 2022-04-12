<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fs, os, path } from "../lib/node";
import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils";
import "../index.scss";

const count = ref(0);

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
onMounted(() => {
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

<template>
  <div className="app">
    <header className="app-header">
      <img src="../assets/bolt-cep.svg" className="icon" />
      <div className="stack-icons">
        <div>
          <img src="../assets/vite.svg" />
          Vite
        </div>
        +
        <div>
          <img src="../assets/vue.svg" />
          Vue
        </div>
        +
        <div>
          <img src="../assets/typescript.svg" />
          TypeScript
        </div>
        +
        <div>
          <img src="../assets/sass.svg" />
          Sass
        </div>
      </div>
      <div className="button-group">
        <button @click="count++">Count is: {{ count }}</button>
        <button @click="nodeTest">
          <img className="icon-button" src="../assets/node-js.svg" />
        </button>
        <button @click="jsxTest">
          <img className="icon-button" src="../assets/adobe.svg" />
        </button>
      </div>

      <p>Edit <code>app.vue</code> and save to test HMR updates.</p>
      <p>
        <button
          @click="
            () => openLinkInBrowser('https://github.com/hyperbrew/bolt-cep')
          "
        >
          Bolt Docs
        </button>
        |
        <button @click="() => openLinkInBrowser('https://v3.vuejs.org/')">
          Vue Docs
        </button>
        |
        <button
          @click="
            () => openLinkInBrowser('https://vitejs.dev/guide/features.html')
          "
        >
          Vite Docs
        </button>
      </p>
    </header>
  </div>
</template>
