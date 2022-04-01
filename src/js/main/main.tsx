import { useEffect, useState } from "react";
import { os, path, fs } from "../lib/node";
import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils";

import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import tsLogo from "../assets/typescript.svg";
import sassLogo from "../assets/sass.svg";

import nodeJs from "../assets/node-js.svg";
import adobe from "../assets/adobe.svg";
import bolt from "../assets/bolt-cep.svg";

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
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <img src={bolt} className="icon" />
        <div className="stack-icons">
          <div>
            <img src={viteLogo} />
            Vite
          </div>
          +
          <div>
            <img src={reactLogo} />
            React
          </div>
          +
          <div>
            <img src={tsLogo} />
            TypeScript
          </div>
          +
          <div>
            <img src={sassLogo} />
            Sass
          </div>
        </div>
        <div className="button-group">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is: {count}
          </button>
          <button onClick={nodeTest}>
            <img className="icon-button" src={nodeJs} />
          </button>
          <button onClick={jsxTest}>
            <img className="icon-button" src={adobe} />
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
