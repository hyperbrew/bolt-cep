import { useState } from "react";
import { FaBolt, FaNodeJs, FaReact, FaAdobe } from "react-icons/fa";
import { os, path, fs } from "../lib/node";
import { csi, evalES } from "../lib/utils";

import logo from "../logo.svg";

import "./main.scss";

const Main = () => {
  const [count, setCount] = useState(0);

  async function jsxTest() {
    console.log(
      await evalES(
        `alert("Hello from ExtendScript :: " + app.appName + " " + app.version)`,
        true
      )
    );
    // console.log(await evalES(`helloWorld("${csi.getApplicationID()}")`));
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Bolt CEP</h1>
        <FaBolt />
        <p>Vite + React + TypeScript + Scss</p>
        <div className="button-group">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is: {count}
          </button>
          <button
            onClick={() =>
              alert(
                `Node.js ${process.version}\nPlatform: ${
                  os.platform
                }\nFolder: ${path.basename(window.cep_node.global.__dirname)}`
              )
            }
          >
            <FaNodeJs />
          </button>
          <button onClick={jsxTest}>
            <FaAdobe />
          </button>
        </div>
        <p>
          Edit <code>app.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="app-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="app-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
};

export default Main;
