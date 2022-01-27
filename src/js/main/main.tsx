import { useEffect, useState } from "react";
import { FaBolt, FaNodeJs, FaAdobe } from "react-icons/fa";
import { os, path } from "../lib/node";
import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils";

import logo from "../logo.svg";

import "./main.scss";

const Main = () => {
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    if (window.cep) {
      console.log(`${csi.getSystemPath("extension")}/jsx/index.js`);
      evalFile(`${csi.getSystemPath("extension")}/jsx/index.js`).then(() => {});
    }
  }, []);

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
          <button onClick={nodeTest}>
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
          <button
            className="app-link"
            onClick={() => openLinkInBrowser("https://reactjs.org")}
          >
            Learn React
          </button>
          {" | "}
          <button
            className="app-link"
            onClick={() =>
              openLinkInBrowser("https://vitejs.dev/guide/features.html")
            }
          >
            Vite Docs
          </button>
        </p>
      </header>
    </div>
  );
};

export default Main;
