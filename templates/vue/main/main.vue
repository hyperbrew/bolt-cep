<script setup lang="ts">
import path from "path";
import { ref } from "vue";
import { os } from "../lib/node";
import { csi, evalES, openLinkInBrowser } from "../lib/utils";
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
</script>

<template>
  <div className="app">
    <header className="app-header">
      <img className="app-logo" alt="Vue logo" src="./vue-logo.png" />
      <h1>Bolt CEP</h1>
      <img className="icon" src="../assets/bolt.svg" />
      <p>Vite + Vue + TypeScript + Scss</p>
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
