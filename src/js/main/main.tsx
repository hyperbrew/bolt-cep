import { useEffect, useState } from "react";
import { os, path, fs } from "../lib/node";
import {
  csi,
  evalES,
  evalFile,
  openLinkInBrowser,
  subscribeBackgroundColor,
  evalTS,
} from "../lib/utils";

import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import tsLogo from "../assets/typescript.svg";
import sassLogo from "../assets/sass.svg";

import nodeJs from "../assets/node-js.svg";
import adobe from "../assets/adobe.svg";
import bolt from "../assets/bolt-cep.svg";

import "./main.scss";

const Main = () => {
  const [bgColor, setBgColor] = useState("#282c34");
  const [count, setCount] = useState(0);

  const jsxTest = () => {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
  };

  const jsxStr = async () => {
    const res = await evalTS("helloStr", ["test"]);
    console.log(res);
  };
  const jsxNum = () => {
    evalTS("helloNum", [1000]).then((res) => {
      console.log(typeof res, res);
    });
  };
  const jsxArray = () => {
    evalTS("helloArrayStr", [["ddddd", "aaaaaa", "zzzzzzz"]]).then((res) => {
      console.log(typeof res, res);
    });
  };
  const jsxObj = () => {
    evalTS("helloObj", [{ height: 90, width: 100 }]).then((res) => {
      console.log(typeof res, res);
      console.log(res.height);
      console.log(res.width);
    });
  };
  const jsxError = () => {
    evalTS("helloError", ["test"])
      .then((res) => {
        console.log("success");
      })
      .catch((e) => {
        console.log("there was an error");
      });
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
      subscribeBackgroundColor(setBgColor);
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
    <div className="app" style={{ backgroundColor: bgColor }}>
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
        <hr />
        <div className="button-group">
          <button onClick={jsxStr}>string</button>
          <button onClick={jsxNum}>number</button>
          <button onClick={jsxArray}>array</button>
          <button onClick={jsxObj}>object</button>
          <button onClick={jsxError}>error</button>
        </div>
        <p>
          Edit <code>main.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <button
            className="app-link"
            onClick={() =>
              openLinkInBrowser("https://github.com/hyperbrew/bolt-cep")
            }
          >
            Bolt Docs
          </button>
          {" | "}
          <button
            className="app-link"
            onClick={() => openLinkInBrowser("https://reactjs.org")}
          >
            React Docs
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
